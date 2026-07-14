import Link from "next/link";
import { IconMail, IconPhone, IconPin } from "@/components/icons";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-ink text-white/80">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs font-semibold tracking-wide text-white/50">CONTACT</p>
            <h2 className="mt-2 text-2xl font-black text-white">오시는 길 &amp; 문의</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/60">
              사회적협동조합 청소년자립학교는 전북 익산에서 학교 밖 청소년의
              자립을 돕고 있습니다. 언제든 편하게 문의해 주세요.
            </p>

            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
                <span>전라북도 익산시 무왕로 7길 38</span>
              </li>
              <li className="flex items-start gap-3">
                <IconPhone className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
                <span>사무국 063-837-0129 · 청년식당 063-837-1119</span>
              </li>
              <li className="flex items-start gap-3">
                <IconMail className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
                <a href="mailto:200233sook@naver.com" className="hover:text-white">
                  200233sook@naver.com
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="font-semibold text-white">바로가기</p>
              <ul className="mt-4 space-y-3 text-white/60">
                <li><Link href="/#about" className="hover:text-white">소개</Link></li>
                <li><Link href="/#programs" className="hover:text-white">사업안내</Link></li>
                <li><Link href="/#support-target" className="hover:text-white">지원대상</Link></li>
                <li><Link href="/data-room" className="hover:text-white">자료실</Link></li>
                <li><Link href="/#donate" className="hover:text-white">후원안내</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white">기관 정보</p>
              <ul className="mt-4 space-y-3 text-white/60">
                <li>사회적협동조합 청소년자립학교</li>
                <li>이사장 안윤숙</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 사회적협동조합 청소년자립학교. All rights reserved.</p>
          <p>청소년이 보다 즐거운 세상을 꿈꿀 수 있도록 지원하는 공익활동</p>
        </div>
      </div>
    </footer>
  );
}
