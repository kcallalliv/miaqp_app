import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Container,
  Heading,
  Text,
  Badge,
  Table,
  Button,
} from "@medusajs/ui";
import { useEffect, useState } from "react";

type Tendencia = "sube" | "estable" | "baja";

interface Signal {
  termino: string;
  disciplina: string;
  categoria: string;
  tendencia: Tendencia;
  score: number;
  fuente: "google_trends" | "interno";
  sugerencia: string;
}

interface EventoProx {
  id: string;
  titulo: string;
  disciplina: string;
  departamento: string;
  fecha_inicio: string;
  dias_restantes: number;
  ventana_compra: boolean;
}

interface Intel {
  experimento: {
    id: string;
    nombre: string;
    hipotesis: string;
    variantes: string[];
    kpi_primario: string;
    kpi_guardia: string;
    lectura: string;
    estado: string;
  };
  proximos_eventos: EventoProx[];
  radar: { fuente: "google_trends" | "interno"; signals: Signal[] };
}

const tendColor = (t: Tendencia) =>
  t === "sube" ? "green" : t === "baja" ? "red" : "grey";

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" }).format(new Date(iso));

const IntelPage = () => {
  const [data, setData] = useState<Intel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/admin/intel", { credentials: "include" });
        setData(await res.json());
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Container className="p-6">
        <Text className="text-ui-fg-subtle">Cargando inteligencia…</Text>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container className="p-6">
        <Text className="text-ui-fg-subtle">
          No se pudo cargar el panel. Revisa que el backend esté activo.
        </Text>
      </Container>
    );
  }

  const { experimento, proximos_eventos, radar } = data;

  return (
    <div className="flex flex-col gap-4">
      {/* Experimento A/B activo */}
      <Container className="p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <Heading level="h1">Inteligencia CAVI</Heading>
            <Text className="text-ui-fg-subtle mt-1 text-sm">
              Qué comprar · qué eventos vienen · experimento activo
            </Text>
          </div>
          <Badge color={experimento.estado === "activo" ? "green" : "grey"}>
            Experimento {experimento.estado}
          </Badge>
        </div>
        <div className="border-t px-6 py-4">
          <Text className="font-medium">{experimento.nombre}</Text>
          <Text className="text-ui-fg-subtle mt-1 text-sm">
            {experimento.hipotesis}
          </Text>
          <div className="mt-3 flex flex-wrap gap-2">
            {experimento.variantes.map((v) => (
              <Badge key={v} size="2xsmall">
                {v}
              </Badge>
            ))}
            <Badge size="2xsmall" color="blue">
              KPI: {experimento.kpi_primario}
            </Badge>
            <Badge size="2xsmall" color="orange">
              Guardia: {experimento.kpi_guardia}
            </Badge>
          </div>
          <Text className="text-ui-fg-muted mt-2 text-xs">
            Lectura de resultados: <code>{experimento.lectura}</code> (BigQuery)
          </Text>
        </div>
      </Container>

      {/* Radar de demanda */}
      <Container className="p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <Heading level="h2">Radar de demanda — qué comprar</Heading>
            <Text className="text-ui-fg-subtle mt-1 text-sm">
              Prioriza stock por interés y por los eventos que se aproximan.
            </Text>
          </div>
          <Badge color={radar.fuente === "google_trends" ? "blue" : "grey"}>
            {radar.fuente === "google_trends" ? "Google Trends" : "Señal interna"}
          </Badge>
        </div>
        <div className="px-6 pb-2">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Término</Table.HeaderCell>
                <Table.HeaderCell>Disciplina</Table.HeaderCell>
                <Table.HeaderCell>Interés</Table.HeaderCell>
                <Table.HeaderCell>Tendencia</Table.HeaderCell>
                <Table.HeaderCell>Sugerencia de compra</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {radar.signals.map((s, i) => (
                <Table.Row key={`${s.termino}-${i}`}>
                  <Table.Cell className="font-medium">{s.termino}</Table.Cell>
                  <Table.Cell>{s.disciplina}</Table.Cell>
                  <Table.Cell>{s.score}</Table.Cell>
                  <Table.Cell>
                    <Badge size="2xsmall" color={tendColor(s.tendencia)}>
                      {s.tendencia}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-ui-fg-subtle text-sm">
                    {s.sugerencia}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Container>

      {/* Próximos eventos */}
      <Container className="p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Próximos eventos</Heading>
          <Text className="text-ui-fg-subtle mt-1 text-sm">
            Ventana de compra sugerida: entre 7 y 45 días antes del evento.
          </Text>
        </div>
        <div className="px-6 pb-2">
          {proximos_eventos.length === 0 ? (
            <Text className="text-ui-fg-subtle py-4 text-sm">
              No hay eventos futuros aprobados. Carga eventos en la Agenda.
            </Text>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Evento</Table.HeaderCell>
                  <Table.HeaderCell>Disciplina</Table.HeaderCell>
                  <Table.HeaderCell>Departamento</Table.HeaderCell>
                  <Table.HeaderCell>Fecha</Table.HeaderCell>
                  <Table.HeaderCell>Faltan</Table.HeaderCell>
                  <Table.HeaderCell>Acción</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {proximos_eventos.map((e) => (
                  <Table.Row key={e.id}>
                    <Table.Cell className="font-medium">{e.titulo}</Table.Cell>
                    <Table.Cell>{e.disciplina}</Table.Cell>
                    <Table.Cell>{e.departamento}</Table.Cell>
                    <Table.Cell>{fmt(e.fecha_inicio)}</Table.Cell>
                    <Table.Cell>{e.dias_restantes} días</Table.Cell>
                    <Table.Cell>
                      {e.ventana_compra ? (
                        <Badge size="2xsmall" color="green">
                          Reforzar stock
                        </Badge>
                      ) : (
                        <Badge size="2xsmall" color="grey">
                          Monitorear
                        </Badge>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </div>
      </Container>

      <div className="px-1 pb-6">
        <Button
          variant="secondary"
          size="small"
          onClick={() => window.location.reload()}
        >
          Actualizar
        </Button>
      </div>
    </div>
  );
};

export const config = defineRouteConfig({
  label: "Inteligencia",
});

export default IntelPage;
