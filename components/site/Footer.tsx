import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { CATEGORIES } from "@/lib/categories";

export function Footer() {
  return (
    <footer className="border-t border-[--color-graphite] bg-[--color-carbon]">
      <div className="container-cavi grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-[--color-muted]">
            La tienda de performance para quienes entrenan con objetivos. Running,
            natación y endurance a nivel nacional.
          </p>
          <div className="mt-5 flex gap-2">
            {["Culqi", "Visa", "Mastercard", "Yape"].map((m) => (
              <span
                key={m}
                className="rounded-md border border-[--color-graphite] bg-[--color-surface] px-2.5 py-1 text-[11px] text-[--color-muted]"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        <FooterCol
          title="Deportes"
          links={CATEGORIES.slice(0, 4).map((c) => ({ label: c.name, href: "/" }))}
        />
        <FooterCol
          title="Ayuda"
          links={[
            { label: "Envíos y entregas", href: "/legal/envios" },
            { label: "Cambios y devoluciones", href: "/legal/envios" },
            { label: "Libro de Reclamaciones", href: "/reclamaciones" },
            { label: "Contacto", href: "/reclamaciones" },
          ]}
        />
        <FooterCol
          title="Legal"
          links={[
            { label: "Términos y condiciones", href: "/legal/terminos" },
            { label: "Política de privacidad", href: "/legal/privacidad" },
            { label: "Envíos y devoluciones", href: "/legal/envios" },
            { label: "Libro de Reclamaciones", href: "/reclamaciones" },
          ]}
        />
      </div>

      <div className="border-t border-[--color-graphite]">
        <div className="container-cavi flex flex-col items-center justify-between gap-3 py-5 text-xs text-[--color-muted] sm:flex-row">
          <span>© {new Date().getFullYear()} CAVI STORE. Todos los derechos reservados.</span>
          <span className="flex items-center gap-4">
            <Link href="/legal/terminos" className="hover:text-[--color-ink]">
              Términos
            </Link>
            <Link href="/legal/privacidad" className="hover:text-[--color-ink]">
              Privacidad
            </Link>
            <Link
              href="/reclamaciones"
              className="rounded-md border border-[--color-graphite] px-2.5 py-1 font-medium text-[--color-ink] hover:border-[--color-volt]"
            >
              📕 Libro de Reclamaciones
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="mb-3 font-display text-sm font-semibold text-[--color-ink]">
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-[--color-muted] hover:text-[--color-volt]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
