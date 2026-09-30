import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Container,
  Heading,
  Text,
  Badge,
  Table,
  Button,
  Textarea,
  toast,
} from "@medusajs/ui";
import { useEffect, useState } from "react";

interface Reclamo {
  id: string;
  correlativo: string;
  tipo: string;
  tipo_bien: string;
  nombre: string;
  tipo_documento: string;
  numero_documento: string;
  email: string;
  telefono?: string | null;
  detalle: string;
  pedido_consumidor?: string | null;
  monto_reclamado?: number | null;
  estado: string;
  respuesta?: string | null;
  created_at: string;
}

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(iso),
  );

const ReclamosPage = () => {
  const [items, setItems] = useState<Reclamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/admin/reclamos", { credentials: "include" });
      const data = await res.json();
      setItems(data.reclamos ?? []);
    } catch {
      toast.error("No se pudo cargar el libro");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function responder(id: string) {
    if (respuesta.trim().length < 5) {
      toast.error("Escribe la respuesta");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/admin/reclamos/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuesta }),
      });
      if (!res.ok) throw new Error();
      toast.success("Respuesta registrada");
      setOpenId(null);
      setRespuesta("");
      load();
    } catch {
      toast.error("No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  const pendientes = items.filter((r) => r.estado === "pendiente").length;

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Libro de Reclamaciones</Heading>
          <Text className="text-ui-fg-subtle mt-1 text-sm">
            Respuesta obligatoria dentro de 15 días hábiles (Indecopi).
          </Text>
        </div>
        {pendientes > 0 && (
          <Badge color="orange">{pendientes} pendiente(s)</Badge>
        )}
      </div>

      <div className="px-6 py-2">
        {loading ? (
          <Text className="text-ui-fg-subtle py-6 text-sm">Cargando…</Text>
        ) : items.length === 0 ? (
          <Text className="text-ui-fg-subtle py-6 text-sm">
            Aún no hay reclamos ni quejas.
          </Text>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Correlativo</Table.HeaderCell>
                <Table.HeaderCell>Fecha</Table.HeaderCell>
                <Table.HeaderCell>Tipo</Table.HeaderCell>
                <Table.HeaderCell>Consumidor</Table.HeaderCell>
                <Table.HeaderCell>Estado</Table.HeaderCell>
                <Table.HeaderCell>Acción</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.map((r) => (
                <>
                  <Table.Row key={r.id}>
                    <Table.Cell className="font-medium">{r.correlativo}</Table.Cell>
                    <Table.Cell>{fmt(r.created_at)}</Table.Cell>
                    <Table.Cell>
                      <Badge size="2xsmall" color={r.tipo === "queja" ? "grey" : "blue"}>
                        {r.tipo}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      {r.nombre}
                      <span className="text-ui-fg-muted block text-xs">
                        {r.tipo_documento} {r.numero_documento} · {r.email}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        size="2xsmall"
                        color={r.estado === "respondido" ? "green" : "orange"}
                      >
                        {r.estado}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => {
                          setOpenId(openId === r.id ? null : r.id);
                          setRespuesta(r.respuesta ?? "");
                        }}
                      >
                        {openId === r.id ? "Cerrar" : "Ver / responder"}
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                  {openId === r.id && (
                    <Table.Row key={`${r.id}-d`}>
                      <Table.Cell colSpan={6}>
                        <div className="bg-ui-bg-subtle flex flex-col gap-3 rounded-lg p-4">
                          <div>
                            <Text size="small" weight="plus">
                              Detalle del {r.tipo}
                            </Text>
                            <Text size="small" className="text-ui-fg-subtle">
                              {r.detalle}
                            </Text>
                          </div>
                          {r.pedido_consumidor && (
                            <div>
                              <Text size="small" weight="plus">
                                Pedido del consumidor
                              </Text>
                              <Text size="small" className="text-ui-fg-subtle">
                                {r.pedido_consumidor}
                              </Text>
                            </div>
                          )}
                          <div>
                            <Text size="small" weight="plus">
                              Respuesta de CAVI STORE
                            </Text>
                            <Textarea
                              rows={3}
                              value={respuesta}
                              onChange={(e) => setRespuesta(e.target.value)}
                              placeholder="Escribe la respuesta formal al consumidor…"
                            />
                          </div>
                          <div>
                            <Button
                              size="small"
                              isLoading={saving}
                              onClick={() => responder(r.id)}
                            >
                              Guardar respuesta
                            </Button>
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Reclamaciones",
});

export default ReclamosPage;
