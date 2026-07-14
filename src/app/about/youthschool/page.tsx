import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  IconArrowRight,
  IconCompass,
  IconHeartHands,
  IconSparkle,
} from "@/components/icons";

const SCHOOL_ROLES = [
  {
    icon: IconHeartHands,
    title: "치유학교",
    description:
      "가정과 학교, 사회에서 소외되어 어려움을 겪는 청소년이 마음의 상처를 돌보고 안정을 되찾도록 함께합니다.",
  },
  {
    icon: IconCompass,
    title: "길잡이학교",
    description:
      "삶의 방향을 찾고 한 걸음씩 앞으로 나아갈 수 있도록 진로와 일상의 과정을 끝까지 안내합니다.",
  },
  {
    icon: IconSparkle,
    title: "꿈개발학교",
    description:
      "청소년을 문제로 규정하지 않고 가능성에 집중하여, 자기만의 꿈을 발견하고 역량을 키우도록 지원합니다.",
  },
];

const INDEPENDENCE = [
  {
    image: "/images/about/youthschool/independence-1.png",
    label: "개인 내적 자립",
    result: "심리·정서 안정",
    description: "건강한 몸과 마음을 돌보고 스스로를 이해하는 힘을 기릅니다.",
  },
  {
    image: "/images/about/youthschool/independence-2.png",
    label: "사회적 자립",
    result: "사회성 향상",
    description: "관계를 맺고 공동체 안에서 책임 있게 살아가는 방법을 배웁니다.",
  },
  {
    image: "/images/about/youthschool/independence-3.png",
    label: "경제적 자립",
    result: "독립생활 유지",
    description: "적성과 진로를 찾고 안정적인 독립생활을 준비합니다.",
  },
];

const SUPPORT_TARGETS = [
  {
    image: "/images/about/youthschool/target-1.jpg",
    title: "취약계층 청소년",
    description: "학업을 중단한 16~20세 청소년을 중심으로 함께합니다.",
  },
  {
    image: "/images/about/youthschool/target-2.jpg",
    title: "시설 퇴소 청소년",
    description: "진로지도와 직업훈련이 필요하고 자립 의지가 있는 청소년을 돕습니다.",
  },
  {
    image: "/images/about/youthschool/target-3.jpg",
    title: "법원 위탁 청소년",
    description: "보호처분을 받았거나 보호관찰 중인 청소년의 회복과 자립을 지원합니다.",
  },
];

const PROGRAM_SYSTEM = [
  {
    image: "/images/about/youthschool/role-2.png",
    title: "생활 기반",
    description: "안전한 주거와 생활 돌봄을 통해 다시 시작할 수 있는 기반을 만듭니다.",
  },
  {
    image: "/images/about/youthschool/role-1.png",
    title: "배움과 진로",
    description: "기초역량 강화, 적성 탐색, 현장 경험과 취·창업 준비를 이어갑니다.",
  },
  {
    image: "/images/about/youthschool/role-3.png",
    title: "지역 연대",
    description: "시설·대학·시민단체와 협력해 청소년을 지지하는 지역 안전망을 만듭니다.",
  },
];

export const metadata: Metadata = {
  title: "청소년자립학교 소개 | 사회적협동조합 청소년자립학교",
  description:
    "청소년자립학교의 설립 목적, 미션과 철학, 지원대상 및 자립지원 사업을 소개합니다.",
};

export default function YouthschoolAboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-14">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary">
              SOCIAL COOPERATIVE
            </p>
            <h1 className="mt-3 text-3xl font-black leading-[1.15] tracking-tight text-ink sm:text-4xl">
              청소년이 더 즐거운 세상을
              <br />
              꿈꿀 수 있도록
            </h1>
            <p className="mt-4 max-w-xl text-base font-medium leading-7 text-body">
              청소년자립학교는 사회적협동조합의 이념 아래 시설·대학·시민단체가
              함께 청소년의 자주적이고 자립적인 삶을 지원합니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
              <Link
                href="/about/greeting"
                className="rounded-full bg-primary px-5 py-3 text-white transition-colors hover:bg-primary-dark"
              >
                이사장 인사말
              </Link>
              <a
                href="#mission"
                className="rounded-full border border-line bg-paper px-5 py-3 text-ink transition-colors hover:border-primary hover:text-primary"
              >
                미션과 철학
              </a>
              <a
                href="#support-target"
                className="rounded-full border border-line bg-paper px-5 py-3 text-ink transition-colors hover:border-primary hover:text-primary"
              >
                지원대상
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative row-span-2 min-h-[260px] overflow-hidden rounded-[2rem] sm:min-h-[340px]">
              <Image
                src="/images/about/youthschool/mission-1.jpg"
                alt="청소년이 직접 그린 응원 메시지"
                fill
                priority
                sizes="(max-width: 1024px) 50vw, 28vw"
                className="object-cover"
              />
            </div>
            <div className="relative min-h-[124px] overflow-hidden rounded-[2rem] sm:min-h-[162px]">
              <Image
                src="/images/about/youthschool/mission-2.jpg"
                alt="청소년자립학교 활동 공간"
                fill
                sizes="(max-width: 1024px) 50vw, 28vw"
                className="object-cover"
              />
            </div>
            <div className="relative min-h-[124px] overflow-hidden rounded-[2rem] sm:min-h-[162px]">
              <Image
                src="/images/about/youthschool/mission-3.jpg"
                alt="청소년자립학교의 책과 학습 공간"
                fill
                sizes="(max-width: 1024px) 50vw, 28vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary">MISSION &amp; PHILOSOPHY</p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-ink">
            치유하고, 길을 안내하며,
            <br />
            꿈을 키웁니다
          </h2>
          <p className="mt-5 leading-7 text-body">
            청소년의 현재 상황이나 부족한 역량을 문제로만 보지 않습니다. 각자의
            가능성과 속도를 존중하며, 스스로 삶의 방향을 정하고 나아갈 힘을
            기르는 데 초점을 둡니다.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {SCHOOL_ROLES.map((role) => (
            <article key={role.title} className="rounded-3xl border border-line bg-surface p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <role.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-xl font-black text-ink">{role.title}</h3>
              <p className="mt-3 text-sm leading-7 text-body">{role.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-secondary">INDEPENDENCE</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink">
              자립은 세 방향으로 자랍니다
            </h2>
            <p className="mt-4 leading-7 text-body">
              청소년자립학교가 말하는 자립은 경제적인 독립만을 뜻하지 않습니다.
              몸과 마음, 관계와 사회생활, 안정적인 독립생활이 함께 성장하는
              과정입니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {INDEPENDENCE.map((item) => (
              <article key={item.label} className="rounded-3xl bg-paper p-6 sm:p-8">
                <Image
                  src={item.image}
                  alt=""
                  width={300}
                  height={300}
                  className="mx-auto h-44 w-44 object-contain"
                />
                <p className="mt-5 text-xs font-semibold tracking-wide text-muted">{item.label}</p>
                <h3 className="mt-1 text-xl font-black text-ink">{item.result}</h3>
                <p className="mt-3 text-sm leading-6 text-body">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="support-target" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary">WHO WE SUPPORT</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink">
              이런 청소년들과 함께합니다
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-body">
            정원 20명 이내로 운영하며, 청소년상담복지센터·아동보호전문기관·청소년쉼터·보호관찰소 등과 연계합니다.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {SUPPORT_TARGETS.map((target) => (
            <article key={target.title} className="overflow-hidden rounded-3xl border border-line bg-surface">
              <div className="relative aspect-[4/3]">
                <Image
                  src={target.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-black text-ink">{target.title}</h3>
                <p className="mt-2 text-sm leading-6 text-body">{target.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-primary-dark text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-white/60">HOW WE WORK</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">생활에서 지역까지 이어지는 자립지원</h2>
            <p className="mt-4 leading-7 text-white/70">
              주거·교육·취창업과 지역 돌봄을 하나의 흐름으로 연결해 청소년이
              공동체 안에서 자기 삶을 꾸려갈 수 있도록 돕습니다.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PROGRAM_SYSTEM.map((item) => (
              <article key={item.title} className="rounded-3xl border border-white/15 bg-white/5 p-7">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
                  <Image src={item.image} alt="" width={300} height={300} className="h-10 w-10 object-contain" />
                </span>
                <h3 className="mt-6 text-lg font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-5 rounded-3xl bg-white p-7 text-ink sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div>
              <p className="text-xs font-semibold tracking-wide text-primary">RELATED PROGRAM</p>
              <h3 className="mt-2 text-2xl font-black">바자울청소년회복지원시설</h3>
              <p className="mt-2 text-sm leading-6 text-body">
                안전한 보금자리에서 자치적인 생활과 일상 기술을 배우는 주거공동체를 만나보세요.
              </p>
            </div>
            <Link
              href="/about/bajawool"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-dark"
            >
              바자울 소개 보기
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
