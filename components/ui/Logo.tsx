export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
        <rect x="1" y="1" width="38" height="38" rx="10" fill="#15191C" stroke="#343A3F" />
        {/* Chevron de velocidad */}
        <path d="M12 26 L20 12 L28 26" fill="none" stroke="#B8FF32" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 26 L20 19 L24 26" fill="none" stroke="#B8FF32" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
      </svg>
      <span className="font-display text-lg font-bold tracking-tight text-[--color-ink]">
        CAVI<span className="text-[--color-volt]">.</span>STORE
      </span>
    </span>
  );
}
