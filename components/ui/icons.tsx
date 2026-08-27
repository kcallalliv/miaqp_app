import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function CartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2 3h2.2l2 12.3a1.5 1.5 0 0 0 1.5 1.2h9.1a1.5 1.5 0 0 0 1.5-1.2L20 7H5.3" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.9l-5.8 3.05 1.1-6.47L2.6 9.9l6.5-.95L12 2.5z" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l0-8z" />
    </svg>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2 6h11v9H2zM13 9h4l3 3v3h-7z" />
      <circle cx="6.5" cy="17.5" r="1.6" />
      <circle cx="17.5" cy="17.5" r="1.6" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function ReturnIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8a9 9 0 1 1-1 4" />
      <path d="M3 4v4h4" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20s-7-4.35-9.3-8.5C1 8 3 4.5 6.5 4.5c2 0 3.5 1.2 5.5 3.5 2-2.3 3.5-3.5 5.5-3.5C21 4.5 23 8 21.3 11.5 19 15.65 12 20 12 20z" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.05 2a9.94 9.94 0 0 0-8.5 15.07L2 22l5.05-1.32A9.94 9.94 0 1 0 12.05 2zm0 1.9a8.04 8.04 0 0 1 6.83 12.3l-.2.32.6 2.2-2.26-.59-.31.18a8.04 8.04 0 1 1-4.66-14.6zm-2.6 4.02c-.19 0-.5.07-.76.35-.26.28-1 1-1 2.42s1.03 2.8 1.17 3c.14.18 2 3.05 4.85 4.16 2.37.93 2.86.75 3.37.7.51-.05 1.66-.68 1.9-1.34.23-.66.23-1.22.16-1.34-.07-.11-.26-.18-.55-.32-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.63.14-.19.28-.72.91-.89 1.1-.16.18-.32.2-.6.07-.29-.14-1.2-.44-2.28-1.41-.84-.75-1.41-1.68-1.58-1.96-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.49.14-.16.19-.28.28-.46.1-.18.05-.35-.02-.49-.07-.14-.62-1.55-.87-2.12-.22-.53-.44-.46-.6-.46l-.51-.01z" />
    </svg>
  );
}
