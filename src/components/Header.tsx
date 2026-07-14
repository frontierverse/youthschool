"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconClose, IconMenu } from "@/components/icons";

const NAV_ITEMS = [
  { label: "청소년자립학교", href: "/about/youthschool" },
  { label: "인사말", href: "/about/greeting" },
  { label: "바자울", href: "/about/bajawool" },
  { label: "자료실", href: "/data-room" },
  { label: "후원안내", href: "/#donate" },
  { label: "오시는길", href: "/#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="사회적협동조합 청소년자립학교"
            width={678}
            height={186}
            priority
            className="h-11 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-body transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#donate"
            className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent-dark md:inline-block"
          >
            후원하기
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="메뉴 열기"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink md:hidden"
          >
            {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-surface px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-body hover:bg-primary-light hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#donate"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-accent px-4 py-3 text-center text-base font-bold text-white"
            >
              후원하기
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
