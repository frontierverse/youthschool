import {
  IconArrowRight,
  IconBowl,
  IconCompass,
  IconHeartHands,
  IconHome,
  IconMail,
  IconPhone,
  IconScale,
  IconShield,
  IconSparkle,
  IconUsers,
} from "@/components/icons";

const PILLARS = [
  { label: "심리정서안정" },
  { label: "사회성 향상" },
  { label: "독립생활 유지" },
];

const ROLES = [
  {
    icon: IconHeartHands,
    title: "치유학교",
    desc: "상처받고 소외된 청소년의 마음을 보듬고 치유합니다.",
  },
  {
    icon: IconCompass,
    title: "길잡이학교",
    desc: "방황하는 청소년에게 삶의 방향을 함께 찾아줍니다.",
  },
  {
    icon: IconSparkle,
    title: "꿈개발학교",
    desc: "스스로 미래를 그릴 수 있도록 역량을 키워줍니다.",
  },
];

const PROGRAMS = [
  {
    icon: IconShield,
    tag: "회복지원시설",
    title: "바자울청소년회복지원시설",
    desc: "소외되고 상처받은 청소년을 위한 회복지원시설을 운영합니다.",
  },
  {
    icon: IconBowl,
    tag: "돌봄사업",
    title: "청년식당",
    desc: "따뜻한 한 끼와 함께 일자리를 제공하는 돌봄 사업입니다.",
  },
];

const TARGETS = [
  { icon: IconUsers, text: "학업을 중단한 16~20세 청소년" },
  { icon: IconHome, text: "시설을 퇴소한 청소년" },
  { icon: IconScale, text: "법원에서 위탁된 청소년" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <p className="inline-flex items-center rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold tracking-wide text-primary">
            사회적협동조합 청소년자립학교
          </p>

          <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.15] tracking-tight text-ink sm:text-5xl sm:leading-[1.15]">
            청소년은,
            <br />
            우리의 미래입니다
          </h1>

          <p className="mt-5 max-w-xl text-lg font-medium text-body">
            학교 밖 청소년의 자립을 돕는 일, 사회적협동조합 청소년자립학교가
            합니다.
          </p>

          <p className="mt-4 max-w-xl leading-7 text-body">
            안전한 주거와 배움의 기회가 부족한 학교 밖 청소년들이 심리·정서적
            안정을 되찾고, 사회성을 키워 독립적인 삶을 준비할 수 있도록 곁에서
            함께합니다.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#programs"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
            >
              사업 살펴보기
              <IconArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#donate"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary"
            >
              후원 안내
            </a>
          </div>
        </div>

        <div className="relative border-t border-line bg-surface/70">
          <div className="mx-auto max-w-6xl px-6 py-6">
            <p className="text-xs font-semibold tracking-wide text-muted">
              우리가 정의하는 자립
            </p>
            <div className="mt-3 flex flex-wrap gap-x-10 gap-y-3">
              {PILLARS.map((p, i) => (
                <div key={p.label} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-ink">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About / Mission */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-wide text-primary">
              MISSION
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-ink">
              치유하고, 길을 안내하며,
              <br />
              꿈을 키웁니다
            </h2>
            <p className="mt-5 leading-7 text-body">
              청소년이 보다 즐거운 세상을 꿈꿀 수 있도록 지원하는 것, 그것이
              청소년자립학교의 존재 이유입니다. 사회적협동조합의 이념 아래
              시설과 대학, 시민단체가 함께 협력하여 청소년의 자립을 돕습니다.
            </p>

            <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
              <p className="text-xs font-semibold tracking-wide text-secondary">
                GOAL
              </p>
              <p className="mt-2 text-lg font-bold leading-snug text-ink">
                사회문제 해결과 삶의 질 제고를 위한 청년공동체 구현
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {ROLES.map((role) => (
              <div
                key={role.title}
                className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <role.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-ink">{role.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-body">
                    {role.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-wide text-primary">
              PROGRAMS
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-ink">
              회복과 돌봄을 위한 프로그램
            </h2>
            <p className="mt-4 leading-7 text-body">
              상처받은 청소년의 회복부터 따뜻한 돌봄까지 — 청소년이
              홀로서기까지의 과정을 함께합니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {PROGRAMS.map((program) => (
              <div
                key={program.title}
                className="group rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-primary/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-light text-secondary">
                  <program.icon className="h-5 w-5" />
                </span>
                <p className="mt-5 text-xs font-semibold tracking-wide text-muted">
                  {program.tag}
                </p>
                <h3 className="mt-1 text-lg font-bold text-ink">
                  {program.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-body">
                  {program.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support target */}
      <section id="support-target" className="bg-primary-dark text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wide text-white/60">
                지원대상
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight">
                이런 청소년들과 함께합니다
              </h2>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">최대 20명</span>
              <span className="text-sm font-medium text-white/60">
                정원 운영
              </span>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {TARGETS.map((target) => (
              <div
                key={target.text}
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <target.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold leading-6">
                  {target.text}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-sm leading-7 text-white/60">
            청소년상담센터, 복지센터, 아동보호전문기관, 청소년쉼터, 보호관찰소
            등과 연계하여 운영합니다.
          </p>
        </div>
      </section>

      {/* Donate */}
      <section id="donate" className="mx-auto max-w-6xl px-6 py-24">
        <div className="overflow-hidden rounded-3xl border border-line bg-surface">
          <div className="grid gap-8 p-10 sm:p-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold tracking-wide text-accent">
                후원안내
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-ink">
                청소년의 자립을,
                <br />
                함께 응원해주세요
              </h2>
              <p className="mt-4 max-w-md leading-7 text-body">
                여러분의 관심과 후원이 학교 밖 청소년이 다시 일어설 수 있는 힘이
                됩니다.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="tel:063-837-0129"
                className="flex items-center justify-between gap-4 rounded-2xl bg-accent px-6 py-4 text-white transition-colors hover:bg-accent-dark"
              >
                <span className="flex items-center gap-3">
                  <IconPhone className="h-5 w-5" />
                  <span>
                    <span className="block text-xs font-medium text-white/80">
                      전화 문의
                    </span>
                    <span className="block text-base font-bold">
                      063-837-0129
                    </span>
                  </span>
                </span>
                <IconArrowRight className="h-4 w-4" />
              </a>
              <a
                href="mailto:200233sook@naver.com"
                className="flex items-center justify-between gap-4 rounded-2xl border border-line px-6 py-4 text-ink transition-colors hover:border-primary hover:text-primary"
              >
                <span className="flex items-center gap-3">
                  <IconMail className="h-5 w-5" />
                  <span>
                    <span className="block text-xs font-medium text-muted">
                      이메일 문의
                    </span>
                    <span className="block text-base font-bold">
                      200233sook@naver.com
                    </span>
                  </span>
                </span>
                <IconArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
