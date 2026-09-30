import Link from "next/link";
import type { ReactNode } from "react";
import { COMPANY } from "@/lib/company";

const LINKS = [
  { href: "/legal/terminos", label: "Términos y condiciones" },
  { href: "/legal/privacidad", label: "Privacidad" },
  { href: "/legal/envios", label: "Envíos y devoluciones" },
  { href: "/reclamaciones", label: "Libro de Reclamaciones" },
];

/** Marco común de las páginas legales: título, índice y estilos de lectura. */
export function LegalLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-cavi py-14">
      <Link
        href="/"
        className="text-sm text-[--color-muted] hover:text-[--color-volt]"
      >
        ← Volver a la tienda
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[--color-muted]">
            Legal
          </p>
          <ul className="space-y-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-[--color-muted] hover:text-[--color-volt]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <article className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold text-[--color-ink]">
            {title}
          </h1>
          <p className="mt-2 text-xs text-[--color-muted]">
            Última actualización: {COMPANY.legalUpdated}
          </p>
          {intro && <p className="mt-4 text-[--color-muted]">{intro}</p>}
          <div className="legal-prose mt-8 space-y-6 text-sm leading-relaxed text-[--color-muted]">
            {children}
          </div>
        </article>
      </div>
    </div>
  );
}

/** Sección con encabezado, para el cuerpo de los documentos. */
export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 font-display text-lg font-semibold text-[--color-ink]">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
