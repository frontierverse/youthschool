/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS test runner. */
/* Run with: node --test scripts/test-post-actions.cjs
 * Executes the real TypeScript actions with isolated, in-memory dependencies.
 * Import allowlists ensure this runner cannot connect to a database or storage.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const MiB = 1024 * 1024;
const postId = "post-under-test";
const revision = "2026-09-08T00:00:00.000Z";
const storageOrigin = "https://test-only.supabase.co";
const bucket = "test-only-bucket";
const oldFile = {
  id: "attachment-owned-by-post",
  postId,
  fileName: "old.pdf",
  size: 10,
  url: `${storageOrigin}/storage/v1/object/public/${bucket}/resource-posts/${postId}/old.pdf`,
};

function loadSource(relativePath, mocks, env = {}) {
  const filename = path.resolve(root, relativePath);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    fileName: filename,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  const loadedModule = { exports: {} };
  const sandbox = {
    module: loadedModule,
    exports: loadedModule.exports,
    require(specifier) {
      if (Object.prototype.hasOwnProperty.call(mocks, specifier)) return mocks[specifier];
      if (specifier === "@/lib/post-validation") {
        return loadSource("src/lib/post-validation.ts", mocks, env);
      }
      throw new Error(`Unexpected import in isolated test: ${specifier}`);
    },
    File,
    FormData,
    URL,
    Date,
    Error,
    Buffer,
    process: { env: { NODE_ENV: "test", ...env } },
    console: { error() {}, warn() {}, log() {} },
  };
  vm.runInNewContext(outputText, sandbox, { filename });
  return loadedModule.exports;
}

function makeFile(size = 10, name = "new.pdf") {
  return new File([new Uint8Array(size)], name, { type: "application/pdf" });
}

function makeForm({ files = [], removeIds = [], title = "Updated post", body = "First line\nSecond line" } = {}) {
  const form = new FormData();
  form.set("categoryId", "notices");
  form.set("title", title);
  form.set("body", body);
  for (const file of files) form.append("files", file);
  for (const id of removeIds) form.append("removeFileIds", id);
  return form;
}

function actionHarness(options = {}) {
  const events = [];
  const created = [];
  const cleanups = [];
  const viewQueries = [];
  const cookieWrites = [];
  let uploadCount = 0;
  let currentPost = options.missingPost ? null : {
    id: postId,
    categoryId: "notices",
    title: "Original post",
    body: ["Original body"],
    files: [{ ...oldFile }],
    attachments: [],
    updatedAt: new Date(revision),
  };
  const matches = (where) => currentPost && where.id === postId && (
    !where.updatedAt || new Date(where.updatedAt).getTime() === currentPost.updatedAt.getTime()
  );
  const resourcePost = {
    async findUnique() {
      events.push("read-post");
      return currentPost;
    },
    async create(args) {
      events.push("create-post");
      if (options.failCreate) throw new Error("simulated DB failure");
      created.push(args.data);
      return { ...args.data, id: args.data.id || postId };
    },
    async updateMany(args) {
      events.push("update-post");
      if (options.staleCommit || !matches(args.where)) return { count: 0 };
      currentPost = { ...currentPost, ...args.data };
      return { count: 1 };
    },
    async deleteMany(args) {
      events.push("delete-post");
      if (options.failDelete) throw new Error("simulated delete failure");
      if (options.staleCommit || !matches(args.where)) return { count: 0 };
      currentPost = null;
      return { count: 1 };
    },
  };
  const postAttachment = {
    async deleteMany(args) {
      events.push("delete-file-rows");
      assert.equal(args.where.postId, postId, "file deletion must be scoped to this post");
      const ids = args.where.id?.in || [];
      currentPost = { ...currentPost, files: currentPost.files.filter((file) => !ids.includes(file.id)) };
      return { count: ids.length };
    },
    async createMany(args) {
      events.push("create-file-rows");
      if (options.failAttachmentInsert) throw new Error("simulated attachment insert failure");
      currentPost = { ...currentPost, files: [...currentPost.files, ...args.data] };
      return { count: args.data.length };
    },
  };
  const prisma = {
    async $executeRaw(parts, ...values) {
      events.push("record-view");
      viewQueries.push({ sql: parts.join("?"), values });
      return currentPost ? 1 : 0;
    },
    resourceCategory: { async findUnique() { return { id: "notices" }; } },
    resourcePost,
    postAttachment,
    async $transaction(callback) {
      events.push("begin-transaction");
      const snapshot = structuredClone(currentPost);
      try {
        const result = await callback({ resourcePost, postAttachment });
        events.push("commit-transaction");
        return result;
      } catch (error) {
        currentPost = snapshot;
        events.push("rollback-transaction");
        throw error;
      }
    },
  };
  const storage = {
    async uploadPostAttachment(id, file) {
      events.push(`upload:${file.name}`);
      uploadCount += 1;
      if (uploadCount === options.failUploadAt) throw new Error("simulated upload failure");
      return {
        fileName: file.name,
        size: file.size,
        url: `${storageOrigin}/storage/v1/object/public/${bucket}/resource-posts/${id}/${file.name}`,
      };
    },
    async removePostAttachments(id, files) {
      events.push("cleanup-storage");
      cleanups.push({ id, files: [...files] });
      if (options.failCleanup) throw new Error("simulated cleanup failure");
    },
  };
  const mocks = {
    "crypto": { randomUUID: () => postId },
    "node:crypto": { randomUUID: () => postId },
    "@/lib/prisma": { prisma },
    "@/lib/session": { getCurrentAdmin: async () => options.unauthenticated ? null : { id: "admin" } },
    "@/lib/storage": storage,
    "next/cache": { revalidatePath: () => events.push("revalidate") },
    "next/headers": { cookies: async () => ({
      get() { return options.alreadyViewed ? { value: "1" } : undefined; },
      set(...args) { cookieWrites.push(args); },
    }) },
    "next/navigation": {
      redirect(location) {
        const error = new Error("NEXT_REDIRECT");
        error.location = location;
        throw error;
      },
    },
  };
  const actions = loadSource("src/app/data-room/actions.ts", mocks);
  return { actions, events, created, cleanups, viewQueries, cookieWrites, get post() { return currentPost; } };
}

async function assertRedirect(promise, location) {
  await assert.rejects(promise, (error) => error.message === "NEXT_REDIRECT" && error.location === location);
}

test("unauthenticated mutations cannot write records or upload files", async () => {
  const h = actionHarness({ unauthenticated: true });
  const form = makeForm({ files: [makeFile()] });
  const results = [
    await h.actions.createPostAction({}, form),
    await h.actions.updatePostAction(postId, revision, {}, form),
    await h.actions.deletePostAction(postId, revision, {}, form),
  ];
  results.forEach((result) => assert.ok(result.error));
  assert.deepEqual(h.events, []);
});

for (const [description, formOptions] of [
  ["a file over 20 MiB", () => ({ files: [makeFile(20 * MiB + 1)] })],
  ["combined uploads over 20 MiB", () => ({ files: [makeFile(11 * MiB), makeFile(10 * MiB, "second.pdf")] })],
  ["more than ten new files", () => ({ files: Array.from({ length: 11 }, (_, i) => makeFile(1, `${i}.pdf`)) })],
  ["a title over 200 characters", () => ({ title: "x".repeat(201) })],
  ["a body over 100000 characters", () => ({ body: "x".repeat(100001) })],
]) {
  test(`create rejects ${description} before upload or database creation`, async () => {
    const h = actionHarness();
    const result = await h.actions.createPostAction({}, makeForm(formOptions()));
    assert.ok(result.error);
    assert.equal(h.created.length, 0);
    assert.ok(!h.events.some((event) => event.startsWith("upload:")));
  });
  test(`edit rejects ${description} before upload or database changes`, async () => {
    const h = actionHarness();
    const result = await h.actions.updatePostAction(postId, revision, {}, makeForm(formOptions()));
    assert.ok(result.error);
    assert.equal(h.post.title, "Original post");
    assert.ok(!h.events.includes("update-post"));
    assert.ok(!h.events.some((event) => event.startsWith("upload:")));
  });
}

test("partial upload failure leaves no post and cleans already uploaded files", async () => {
  const h = actionHarness({ failUploadAt: 2 });
  const result = await h.actions.createPostAction({}, makeForm({ files: [makeFile(), makeFile(10, "second.pdf")] }));
  assert.ok(result.error);
  assert.ok(!h.events.includes("create-post"));
  assert.equal(h.cleanups.flatMap((cleanup) => cleanup.files).length, 1);
  assert.equal(h.cleanups[0].files[0].fileName, "new.pdf");
});

test("database create failure cleans all staged uploads", async () => {
  const h = actionHarness({ failCreate: true });
  const result = await h.actions.createPostAction({}, makeForm({ files: [makeFile(), makeFile(10, "second.pdf")] }));
  assert.ok(result.error);
  assert.equal(h.created.length, 0);
  assert.equal(h.cleanups.flatMap((cleanup) => cleanup.files).length, 2);
  assert.ok(h.events.indexOf("create-post") > h.events.indexOf("upload:second.pdf"));
});

test("successful creation stores post and attachments together after uploads", async () => {
  const h = actionHarness();
  await assertRedirect(h.actions.createPostAction({}, makeForm({ files: [makeFile()] })), `/data-room/notices/${postId}`);
  assert.equal(h.created.length, 1);
  assert.equal(h.created[0].files.create.length, 1);
  assert.equal(h.created[0].files.create[0].fileName, "new.pdf");
  assert.ok(h.events.indexOf("create-post") > h.events.indexOf("upload:new.pdf"));
  assert.equal(h.cleanups.length, 0);
});

test("editing cannot remove an attachment owned by another post", async () => {
  const h = actionHarness();
  const result = await h.actions.updatePostAction(postId, revision, {}, makeForm({ removeIds: ["foreign-file"], files: [makeFile()] }));
  assert.ok(result.error);
  assert.ok(!h.events.includes("update-post"));
  assert.ok(!h.events.some((event) => event.startsWith("upload:")));
  assert.equal(h.cleanups.length, 0);
  assert.equal(h.post.files[0].id, oldFile.id);
});

test("failed edit transaction preserves the original post and files and cleans only new uploads", async () => {
  const h = actionHarness({ failAttachmentInsert: true });
  const result = await h.actions.updatePostAction(postId, revision, {}, makeForm({ removeIds: [oldFile.id], files: [makeFile()] }));
  assert.ok(result.error);
  assert.equal(h.post.title, "Original post");
  assert.equal(h.post.files[0].id, oldFile.id);
  assert.ok(h.events.includes("rollback-transaction"));
  const removed = h.cleanups.flatMap((cleanup) => cleanup.files);
  assert.equal(removed.length, 1);
  assert.equal(removed[0].fileName, "new.pdf");
});

test("an edit that loses a concurrent update preserves existing files", async () => {
  const h = actionHarness({ staleCommit: true });
  const result = await h.actions.updatePostAction(postId, revision, {}, makeForm({ removeIds: [oldFile.id], files: [makeFile()] }));
  assert.ok(result.error);
  assert.equal(h.post.title, "Original post");
  assert.equal(h.post.files[0].id, oldFile.id);
  assert.ok(!h.events.includes("delete-file-rows"));
  assert.ok(h.cleanups.flatMap((cleanup) => cleanup.files).every((file) => file.url !== oldFile.url));
});

test("successful edit cleans removed storage objects only after database commit", async () => {
  const h = actionHarness();
  await assertRedirect(h.actions.updatePostAction(postId, revision, {}, makeForm({ removeIds: [oldFile.id], files: [makeFile()] })), `/data-room/notices/${postId}`);
  assert.equal(h.post.title, "Updated post");
  assert.equal(h.post.files.length, 1);
  assert.equal(h.post.files[0].fileName, "new.pdf");
  assert.ok(h.events.indexOf("cleanup-storage") > h.events.indexOf("commit-transaction"));
  assert.equal(h.cleanups.flatMap((cleanup) => cleanup.files)[0].url, oldFile.url);
});

test("stale delete does not remove the post or any storage objects", async () => {
  const h = actionHarness({ staleCommit: true });
  const result = await h.actions.deletePostAction(postId, revision, {}, makeForm());
  assert.ok(result.error);
  assert.ok(h.post);
  assert.equal(h.cleanups.length, 0);
});

test("failed delete does not remove storage objects", async () => {
  const h = actionHarness({ failDelete: true });
  const result = await h.actions.deletePostAction(postId, revision, {}, makeForm());
  assert.ok(result.error);
  assert.ok(h.post);
  assert.equal(h.cleanups.length, 0);
});

test("successful delete cleans attachments only after database deletion", async () => {
  const h = actionHarness();
  await assertRedirect(h.actions.deletePostAction(postId, revision, {}, makeForm()), "/data-room?tab=notices");
  assert.equal(h.post, null);
  assert.ok(h.events.indexOf("cleanup-storage") > h.events.indexOf("delete-post"));
  assert.equal(h.cleanups.flatMap((cleanup) => cleanup.files)[0].url, oldFile.url);
});

test("storage cleanup failure after edit still redirects to the committed post with a notice", async () => {
  const h = actionHarness({ failCleanup: true });
  await assertRedirect(
    h.actions.updatePostAction(postId, revision, {}, makeForm({ removeIds: [oldFile.id] })),
    `/data-room/notices/${postId}?notice=attachment-cleanup-failed`,
  );
  assert.equal(h.post.title, "Updated post");
  assert.equal(h.post.files.length, 0);
});

test("storage cleanup failure after deletion still redirects with a notice", async () => {
  const h = actionHarness({ failCleanup: true });
  await assertRedirect(
    h.actions.deletePostAction(postId, revision, {}, makeForm()),
    "/data-room?tab=notices&notice=attachment-cleanup-failed",
  );
  assert.equal(h.post, null);
});

for (const expectedRevision of ["invalid revision", "2026-09-07T00:00:00.000Z"]) {
  test(`edit and delete reject an invalid or outdated revision: ${expectedRevision}`, async () => {
    const h = actionHarness();
    const form = makeForm({ removeIds: [oldFile.id], files: [makeFile()] });
    assert.ok((await h.actions.updatePostAction(postId, expectedRevision, {}, form)).error);
    assert.ok((await h.actions.deletePostAction(postId, expectedRevision, {}, form)).error);
    assert.equal(h.post.title, "Original post");
    assert.ok(h.events.every((event) => event === "read-post"));
  });
}

test("first visit increments only the view counter and sets the existing 24-hour cookie", async () => {
  const h = actionHarness();
  await h.actions.recordPostView(postId);
  assert.equal(h.viewQueries.length, 1);
  assert.deepEqual(h.viewQueries[0].values, [postId]);
  assert.match(h.viewQueries[0].sql, /SET\s+"views"\s*=\s*"views"\s*\+\s*1/);
  assert.doesNotMatch(h.viewQueries[0].sql, /updatedAt/);
  assert.equal(h.cookieWrites[0][0], `viewed_${postId}`);
  assert.equal(h.cookieWrites[0][2].maxAge, 24 * 60 * 60);
});

test("repeat visit with the browser cookie does not increment views", async () => {
  const h = actionHarness({ alreadyViewed: true });
  await h.actions.recordPostView(postId);
  assert.equal(h.viewQueries.length, 0);
  assert.equal(h.cookieWrites.length, 0);
});

test("viewing a deleted post does not leave a misleading viewed cookie", async () => {
  const h = actionHarness({ missingPost: true });
  await h.actions.recordPostView(postId);
  assert.equal(h.cookieWrites.length, 0);
});

function storageHarness() {
  const removed = [];
  const storage = loadSource("src/lib/storage.ts", {
    "crypto": { randomUUID: () => "new-object" },
    "node:crypto": { randomUUID: () => "new-object" },
    "@supabase/supabase-js": {
      createClient() {
        return { storage: { from(selectedBucket) {
          assert.equal(selectedBucket, bucket);
          return { async remove(keys) { removed.push(...keys); return { error: null }; } };
        } } };
      },
    },
  }, {
    NEXT_PUBLIC_SUPABASE_URL: storageOrigin,
    SUPABASE_SERVICE_ROLE_KEY: "test-only-key",
    SUPABASE_STORAGE_BUCKET: bucket,
  });
  return { storage, removed };
}

test("storage cleanup accepts the post's public attachment URL and ignores its query string", async () => {
  const h = storageHarness();
  await h.storage.removePostAttachments(postId, [{ url: `${oldFile.url}?download=old.pdf` }]);
  assert.deepEqual(h.removed, [`resource-posts/${postId}/old.pdf`]);
});

for (const [description, url] of [
  ["an unrelated origin", oldFile.url.replace(storageOrigin, "https://foreign.example")],
  ["another bucket", oldFile.url.replace(`/${bucket}/`, "/other-bucket/")],
  ["another post", oldFile.url.replace(`/${postId}/`, "/another-post/")],
  ["a post with a similar prefix", oldFile.url.replace(`/${postId}/`, `/${postId}-other/`)],
  ["a malformed URL", "not a URL"],
  ["encoded path traversal", `${storageOrigin}/storage/v1/object/public/${bucket}/resource-posts/${postId}/%2e%2e/another-post/file.pdf`],
]) {
  test(`storage cleanup never deletes a URL with ${description}`, async () => {
    const h = storageHarness();
    try {
      await h.storage.removePostAttachments(postId, [{ url }]);
    } catch (error) {
      assert.ok(error instanceof Error);
    }
    assert.deepEqual(h.removed, []);
  });
}
