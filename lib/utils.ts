/** Une clases condicionalmente sin dependencias externas. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function cartKey(productId: string, size?: string, color?: string): string {
  return [productId, size ?? "", color ?? ""].join("|");
}
