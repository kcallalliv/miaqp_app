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
          links={CATEGORIES.slice(0, 4).map((c) => c.name)}
        />
        <FooterCol
          title="Ayuda"
          links={["Envíos y entregas", "Cambios y devoluciones", "Guía de tallas", "Contacto"]}
        />
        <FooterCol
          title="CAVI STORE"
          links={["Nosotros", "Marcas", "Blog de entrenamiento", "Trabaja con nosotros"]}
        />
      </div>

      <div className="border-t border-[--color-graphite]">
        <div className="container-cavi flex flex-col items-center justify-between gap-2 py-5 text-xs text-[--color-muted] sm:flex-row">
          <span>© {new Date().getFullYear()} CAVI STORE. Todos los derechos reservados.</span>
          <span className="flex gap-4">
            <a href="#" className="hover:text-[--color-ink]">Términos</a>
            <a href="#" className="hover:text-[--color-ink]">Privacidad</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="mb-3 font-display text-sm font-semibold text-[--color-ink]">
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm text-[--color-muted] hover:text-[--color-volt]">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
