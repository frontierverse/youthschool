export type IconProps = {
  className?: string;
};

const base = "1.6";

export function IconMenu({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" stroke="currentColor" strokeWidth={base} strokeLinecap="round" />
    </svg>
  );
}

export function IconExternal({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9.5 14.5 19 5M12 5h7v7" stroke="currentColor" strokeWidth={base} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 13.5V18a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V7.5A1.5 1.5 0 0 1 6 6h4.5" stroke="currentColor" strokeWidth={base} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth={base} strokeLinecap="round" />
    </svg>
  );
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4.5 12h15M13 5.5l6.5 6.5-6.5 6.5" stroke="currentColor" strokeWidth={base} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowLeft({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M19.5 12h-15M11 5.5 4.5 12l6.5 6.5" stroke="currentColor" strokeWidth={base} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPaperclip({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M16.5 8.5 9.9 15.1a2.6 2.6 0 1 1-3.7-3.7l7.6-7.6a4 4 0 1 1 5.7 5.7L11.9 17.1a5.4 5.4 0 1 1-7.6-7.6l6.6-6.6"
        stroke="currentColor"
        strokeWidth={base}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconHeartHands({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 19.5s-7-4.35-7-9.2A4.05 4.05 0 0 1 9.2 6.25 4.4 4.4 0 0 1 12 7.7a4.4 4.4 0 0 1 2.8-1.45A4.05 4.05 0 0 1 19 10.3c0 4.85-7 9.2-7 9.2Z"
        stroke="currentColor"
        strokeWidth={base}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCompass({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth={base} />
      <path d="M14.7 9.3 13 13l-3.7 1.7L11 11l3.7-1.7Z" stroke="currentColor" strokeWidth={base} strokeLinejoin="round" />
    </svg>
  );
}

export function IconSparkle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 4.5c.4 2.7 1.3 4.4 3 5.5 1.7.9 3.4 1.3 5.3 1.5-1.9.2-3.6.6-5.3 1.5-1.7 1.1-2.6 2.8-3 5.5-.4-2.7-1.3-4.4-3-5.5C7.3 12 5.6 11.6 3.7 11.4c1.9-.2 3.6-.6 5.3-1.5 1.7-1.1 2.6-2.8 3-5.4Z"
        stroke="currentColor"
        strokeWidth={base}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconHome({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4.5 11.5 12 5l7.5 6.5" stroke="currentColor" strokeWidth={base} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 10v8.5h11V10" stroke="currentColor" strokeWidth={base} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 18.5V14h4v4.5" stroke="currentColor" strokeWidth={base} strokeLinejoin="round" />
    </svg>
  );
}

export function IconBook({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 6.2C10.5 5 8.3 4.5 5.5 4.7v13c2.8-.2 5 .3 6.5 1.5 1.5-1.2 3.7-1.7 6.5-1.5v-13c-2.8-.2-5 .3-6.5 1.5Z"
        stroke="currentColor"
        strokeWidth={base}
        strokeLinejoin="round"
      />
      <path d="M12 6.2v13" stroke="currentColor" strokeWidth={base} />
    </svg>
  );
}

export function IconBriefcase({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="8" width="17" height="11" rx="1.6" stroke="currentColor" strokeWidth={base} />
      <path d="M8.5 8V6.3A1.8 1.8 0 0 1 10.3 4.5h3.4a1.8 1.8 0 0 1 1.8 1.8V8" stroke="currentColor" strokeWidth={base} strokeLinejoin="round" />
      <path d="M3.5 13.2c2.6 1.2 5.5 1.8 8.5 1.8s5.9-.6 8.5-1.8" stroke="currentColor" strokeWidth={base} strokeLinecap="round" />
    </svg>
  );
}

export function IconShield({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 4.5 18.5 7v5c0 4.2-2.7 6.9-6.5 8.5C8.2 18.9 5.5 16.2 5.5 12V7L12 4.5Z"
        stroke="currentColor"
        strokeWidth={base}
        strokeLinejoin="round"
      />
      <path d="M9.3 12.2 11.3 14l3.4-4" stroke="currentColor" strokeWidth={base} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBowl({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 12h16a8 8 0 0 1-8 8 8 8 0 0 1-8-8Z" stroke="currentColor" strokeWidth={base} strokeLinejoin="round" />
      <path d="M8 12V5M12 12V4M16 12V5" stroke="currentColor" strokeWidth={base} strokeLinecap="round" />
    </svg>
  );
}

export function IconPhone({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 4.5h2.6l1.3 3.6-1.8 1.6a10.5 10.5 0 0 0 5.2 5.2l1.6-1.8 3.6 1.3V17a1.5 1.5 0 0 1-1.6 1.5A15 15 0 0 1 4.5 6.1 1.5 1.5 0 0 1 6 4.5Z"
        stroke="currentColor"
        strokeWidth={base}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMail({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.6" stroke="currentColor" strokeWidth={base} />
      <path d="M4.5 6.5 12 12.5l7.5-6" stroke="currentColor" strokeWidth={base} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPin({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 20s6.5-5.6 6.5-10.8A6.5 6.5 0 0 0 5.5 9.2C5.5 14.4 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth={base}
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.2" r="2.2" stroke="currentColor" strokeWidth={base} />
    </svg>
  );
}

export function IconUsers({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="8.5" r="2.6" stroke="currentColor" strokeWidth={base} />
      <path d="M3.8 18c.6-2.8 2.6-4.3 5.2-4.3s4.6 1.5 5.2 4.3" stroke="currentColor" strokeWidth={base} strokeLinecap="round" />
      <path d="M15 7a2.6 2.6 0 0 1 0 5.15M16.9 13.9c2.1.3 3.6 1.7 4.1 4.1" stroke="currentColor" strokeWidth={base} strokeLinecap="round" />
    </svg>
  );
}

export function IconScale({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 4v16M8 20h8" stroke="currentColor" strokeWidth={base} strokeLinecap="round" />
      <path d="M12 6 5 8.5l3.4 6.3a3.6 3.6 0 0 0 6.5-.1L12 6ZM12 6l7 2.5-3.4 6.3a3.6 3.6 0 0 1-6.5-.1L12 6Z" stroke="currentColor" strokeWidth={base} strokeLinejoin="round" />
    </svg>
  );
}
