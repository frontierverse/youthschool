import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  IconArrowRight,
  IconCompass,
  IconHeartHands,
  IconHome,
  IconUsers,
} from "@/components/icons";

const SUPPORT = [
  {
    icon: IconHome,
    title: "안전한 주거",
    description: "청소년이 안정적으로 머물며 일상을 회복할 수 있는 보금자리를 제공합니다.",
  },
  {
    icon: IconUsers,
    title: "자치적인 생활",
    description: "함께 정한 약속을 지키고 서로의 생활을 존중하는 공동체 경험을 쌓습니다.",
  },
  {
    icon: IconHeartHands,
    title: "일상 기술",
    description: "식사 준비, 정리와 청소, 자기관리 등 독립생활에 필요한 기술을 익힙니다.",
  },
  {
    icon: IconCompass,
    title: "회복과 진로",
    description: "마음의 안정을 바탕으로 배움과 진로를 탐색하며 다음 삶을 준비합니다.",
  },
];

const DAILY_LIFE = [
  {
    src: "/images/about/bajawool/facility-01.jpg",
    alt: "바자울 청소년들이 텃밭을 가꾸는 모습",
    label: "함께 가꾸기",
  },
  {
    src: "/images/about/bajawool/facility-02.jpg",
    alt: "바자울 공동체의 식사",
    label: "함께 식사하기",
  },
  {
    src: "/images/about/bajawool/facility-15.jpg",
    alt: "주방에서 설거지를 하는 생활 모습",
    label: "생활 돌보기",
  },
  {
    src: "/images/about/bajawool/facility-16.jpg",
    alt: "책상에서 공부하는 생활 모습",
    label: "배움 이어가기",
  },
];

const FACILITY_GALLERY = [
  "/images/about/bajawool/facility-04.jpg",
  "/images/about/bajawool/facility-05.jpg",
  "/images/about/bajawool/facility-06.jpg",
  "/images/about/bajawool/facility-07.jpg",
  "/images/about/bajawool/facility-08.jpg",
  "/images/about/bajawool/facility-09.jpg",
  "/images/about/bajawool/facility-10.jpg",
  "/images/about/bajawool/facility-11.jpg",
  "/images/about/bajawool/facility-12.jpg",
  "/images/about/bajawool/facility-13.jpg",
  "/images/about/bajawool/facility-14.jpg",
];

export const metadata: Metadata = {
  title: "바자울청소년회복지원시설 소개 | 사회적협동조합 청소년자립학교",
  description:
    "청소년이 안전한 보금자리에서 자치적인 공동체 생활과 자립에 필요한 일상 기술을 배우는 바자울청소년회복지원시설을 소개합니다.",
};

export default function BajawoolAboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-secondary-light">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:py-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:py-14">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-secondary">YOUTH RECOVERY HOME</p>
            <h1 className="mt-3 text-3xl font-black leading-[1.13] tracking-tight text-ink sm:text-4xl">
              우리들이 만들어가는
              <br />
              안전한 주거공동체
            </h1>
            <p className="mt-4 max-w-xl text-base font-medium leading-7 text-body">
              바자울청소년회복지원시설은 자립을 꿈꾸는 청소년이 안정적인 생활을
              이어가도록 안전한 보금자리를 제공합니다.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-body">
              함께 생활하는 청소년들이 공동체의 약속을 만들고 일상을 자치적으로
              운영하며, 독립생활에 필요한 기술과 관계의 힘을 배웁니다.
            </p>
            <a
              href="#life"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
            >
              공동체 생활 보기
              <IconArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] shadow-[0_24px_70px_rgba(44,95,138,0.18)]">
            <Image
              src="/images/about/bajawool/facility-03.jpg"
              alt="바자울청소년회복지원시설 전경"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-secondary">WHAT WE SUPPORT</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-ink">집처럼 편안하게, 학교처럼 든든하게</h2>
          <p className="mt-4 leading-7 text-body">
            주거 공간을 제공하는 데서 멈추지 않고, 청소년이 스스로 일상을
            운영하고 관계를 배우며 미래를 준비할 수 있도록 생활 전반을 함께합니다.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SUPPORT.map((item) => (
            <article key={item.title} className="rounded-3xl border border-line bg-surface p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-light text-secondary">
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-black text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-body">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="life" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.18em] text-primary">DAILY LIFE</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-ink">생활 속에서 자립을 연습합니다</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-body">
              함께 먹고, 가꾸고, 정리하고, 공부하는 평범한 하루가 독립적인 삶을
              만드는 가장 중요한 연습이 됩니다.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DAILY_LIFE.map((item) => (
              <figure key={item.src} className="group overflow-hidden rounded-3xl bg-paper">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="px-5 py-4 text-sm font-bold text-ink">{item.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <p className="text-xs font-semibold tracking-[0.18em] text-white/60">COMMUNITY PRINCIPLES</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight">함께 살기 위해 함께 정하는 세 가지 원칙</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              ["01", "존중", "서로의 공간과 감정, 생활 리듬을 존중합니다."],
              ["02", "책임", "내가 맡은 일을 스스로 해내고 공동체의 약속을 지킵니다."],
              ["03", "회복", "실수해도 다시 시도할 수 있도록 기다리고 함께 해결합니다."],
            ].map(([number, title, description]) => (
              <article key={number} className="rounded-3xl border border-white/15 bg-white/5 p-7">
                <p className="text-sm font-black text-white/40">{number}</p>
                <h3 className="mt-8 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-secondary">SPACE GALLERY</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-ink">바자울의 생활 공간</h2>
          <p className="mt-4 leading-7 text-body">
            개인의 휴식과 공동체 활동이 조화를 이루도록 생활실, 공용공간,
            식사와 배움의 공간을 운영합니다.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {FACILITY_GALLERY.map((src, index) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
              <Image
                src={src}
                alt={`바자울 생활 공간 ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-5 rounded-3xl border border-line bg-surface p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div>
            <p className="text-xs font-semibold tracking-wide text-primary">ORGANIZATION</p>
            <h3 className="mt-2 text-2xl font-black text-ink">사회적협동조합 청소년자립학교</h3>
            <p className="mt-2 text-sm leading-6 text-body">
              바자울은 청소년자립학교가 운영하는 회복과 자립을 위한 주거공동체입니다.
            </p>
          </div>
          <Link
            href="/about/youthschool"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
          >
            청소년자립학교 소개
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
