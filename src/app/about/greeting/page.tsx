import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconArrowRight, IconHeartHands } from "@/components/icons";

export const metadata: Metadata = {
  title: "이사장 인사말 | 사회적협동조합 청소년자립학교",
  description:
    "학교 밖 청소년의 회복과 자립을 함께하는 사회적협동조합 청소년자립학교 안윤숙 이사장의 인사말입니다.",
};

export default function GreetingPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-8 sm:py-10 lg:py-12">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary">
            GREETING
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
            이사장 인사말
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-body">
            모든 청소년이 안전한 일상 안에서 배우고, 꿈꾸고, 자기 삶을
            선택할 수 있도록 함께하겠습니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-16">
          <aside className="lg:sticky lg:top-28">
            <div className="relative mx-auto max-w-sm overflow-hidden rounded-[2rem] bg-primary-light shadow-[0_24px_70px_rgba(20,70,80,0.15)] lg:mx-0">
              <div className="relative aspect-[640/823]">
                <Image
                  src="/images/about/youthschool/chairperson-an-yoonsook.png"
                  alt="사회적협동조합 청소년자립학교 안윤숙 이사장"
                  fill
                  priority
                  sizes="(max-width: 1024px) 384px, 32vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="mt-6 text-center lg:text-left">
              <p className="text-sm text-muted">사회적협동조합 청소년자립학교</p>
              <p className="mt-1 text-xl font-black text-ink">이사장 안윤숙</p>
            </div>
          </aside>

          <article className="max-w-3xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <IconHeartHands className="h-6 w-6" />
            </span>
            <p className="mt-7 text-2xl font-black leading-snug text-ink sm:text-3xl">
              “청소년은 우리의 미래입니다.”
            </p>

            <div className="mt-8 space-y-6 text-base leading-8 text-body sm:text-lg sm:leading-9">
              <p>
                가정해체, 실업, 근로빈곤 등 사회의 어려움은 가장 취약한
                이들의 삶에 먼저 닿습니다. 그중에서도 학교 밖 청소년은
                안전한 주거, 건강한 식사, 충분한 배움과 돌봄의 기회를 놓치기
                쉽습니다.
              </p>
              <p>
                학교 밖 청소년을 위한 정책과 제도가 꾸준히 마련되고 있지만,
                현실의 복지 사각지대를 온전히 해소하기에는 아직 많은 관심과
                연대가 필요합니다. 청소년이 겪는 어려움을 개인의 문제로만
                바라보지 않고, 성장 과정에서 마주한 구조적 문제를 함께 풀어야
                합니다.
              </p>
              <p>
                청소년자립학교는 청소년 한 사람 한 사람의 곁에서 주거와
                생활, 배움과 진로를 연결하는 자립지원을 이어가겠습니다. 각자의
                속도를 존중하며 스스로 삶의 방향을 정하고 나아갈 수 있도록
                든든한 울타리가 되겠습니다.
              </p>
              <p>
                청소년이 오늘을 안전하게 살아내고 더 즐거운 내일을 꿈꿀 수
                있도록 따뜻한 관심과 동행을 부탁드립니다.
              </p>
            </div>

            <div className="mt-10 border-t border-line pt-7 text-right">
              <p className="text-sm text-muted">사회적협동조합 청소년자립학교</p>
              <p className="mt-1 text-lg font-black text-ink">이사장 안윤숙 드림</p>
            </div>
          </article>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary">
              ABOUT US
            </p>
            <h2 className="mt-2 text-2xl font-black text-ink">
              청소년자립학교가 하는 일을 만나보세요
            </h2>
          </div>
          <Link
            href="/about/youthschool"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark sm:self-auto"
          >
            청소년자립학교 소개
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
