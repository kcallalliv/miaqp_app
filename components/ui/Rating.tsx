import { StarIcon } from "./icons";

export function Rating({
  value,
  reviews,
  className = "",
}: {
  value: number;
  reviews?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <StarIcon className="h-3.5 w-3.5 text-[--color-volt]" />
      <span className="text-xs font-semibold text-[--color-ink]">{value.toFixed(1)}</span>
      {reviews !== undefined && (
        <span className="text-xs text-[--color-muted]">({reviews})</span>
      )}
    </span>
  );
}
