import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Calendar } from "@medusajs/icons";
import {
  Container,
  Heading,
  Button,
  Badge,
  Table,
  Input,
  Select,
  Label,
  Checkbox,
  toast,
} from "@medusajs/ui";
import { useEffect, useState } from "react";
import {
  DEPARTAMENTOS,
  DISCIPLINAS,
  ESTADOS,
} from "../../../modules/events/departamentos";

type EventRow = {
  id: string;
  titulo: string;
  disciplina: string;
  departamento: string;
  ciudad?: string | null;
  distancias?: string | null;
  organizador?: string | null;
  url_inscripcion?: string | null;
  fecha_inicio: string;
  estado: string;
  destacado: boolean;
  moderacion: string;
};

const empty = {
  titulo: "",
  disciplina: "trail",
  departamento: "Arequipa",
  ciudad: "",
  distancias: "",
  organizador: "",
  url_inscripcion: "",
  fecha_inicio: "",
  estado: "proximo",
  destacado: false,
};

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" }).format(new Date(iso));

const EventsPage = () => {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/admin/events", { credentials: "include" });
      const data = await res.json();
      setEvents(data.events ?? []);
    } catch {
      toast.error("No se pudo cargar la agenda");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    if (form.titulo.trim().length < 3 || !form.fecha_inicio) {
      toast.error("Título y fecha son obligatorios");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/admin/events", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Evento creado");
      setForm({ ...empty });
      setShowForm(false);
      load();
    } catch {
      toast.error("No se pudo crear");
    } finally {
      setSaving(false);
    }
  }

  async function patch(id: string, body: Record<string, unknown>) {
    try {
      const res = await fetch(`/admin/events/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      load();
    } catch {
      toast.error("No se pudo actualizar");
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este evento?")) return;
    try {
      await fetch(`/admin/events/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      load();
    } catch {
      toast.error("No se pudo eliminar");
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Agenda de eventos</Heading>
          <p className="text-ui-fg-subtle mt-1 text-sm">
            Carreras de endurance en Perú · curación manual
          </p>
        </div>
        <Button variant="secondary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cerrar" : "Nuevo evento"}
        </Button>
      </div>

      {showForm && (
        <div className="grid grid-cols-2 gap-3 px-6 py-4">
          <div className="col-span-2">
            <Label>Título</Label>
            <Input
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            />
          </div>
          <div>
            <Label>Disciplina</Label>
            <Select
              value={form.disciplina}
              onValueChange={(v) => setForm({ ...form, disciplina: v })}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {DISCIPLINAS.map((d) => (
                  <Select.Item key={d} value={d}>
                    {d}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          <div>
            <Label>Departamento</Label>
            <Select
              value={form.departamento}
              onValueChange={(v) => setForm({ ...form, departamento: v })}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {DEPARTAMENTOS.map((d) => (
                  <Select.Item key={d} value={d}>
                    {d}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          <div>
            <Label>Fecha de inicio</Label>
            <Input
              type="date"
              value={form.fecha_inicio}
              onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
            />
          </div>
          <div>
            <Label>Estado</Label>
            <Select
              value={form.estado}
              onValueChange={(v) => setForm({ ...form, estado: v })}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {ESTADOS.map((s) => (
                  <Select.Item key={s} value={s}>
                    {s}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          <div>
            <Label>Ciudad / distrito</Label>
            <Input
              value={form.ciudad}
              onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
            />
          </div>
          <div>
            <Label>Distancias</Label>
            <Input
              placeholder="6K, 21K, 50K"
              value={form.distancias}
              onChange={(e) => setForm({ ...form, distancias: e.target.value })}
            />
          </div>
          <div>
            <Label>Organizador</Label>
            <Input
              value={form.organizador}
              onChange={(e) => setForm({ ...form, organizador: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <Label>URL de inscripción oficial</Label>
            <Input
              value={form.url_inscripcion}
              onChange={(e) =>
                setForm({ ...form, url_inscripcion: e.target.value })
              }
            />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <Checkbox
              checked={form.destacado}
              onCheckedChange={(v) => setForm({ ...form, destacado: !!v })}
            />
            <Label>Destacado</Label>
          </div>
          <div className="col-span-2">
            <Button onClick={create} isLoading={saving}>
              Crear evento
            </Button>
          </div>
        </div>
      )}

      <div className="px-6 py-2">
        {loading ? (
          <p className="text-ui-fg-subtle py-6 text-sm">Cargando…</p>
        ) : events.length === 0 ? (
          <p className="text-ui-fg-subtle py-6 text-sm">Aún no hay eventos.</p>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Título</Table.HeaderCell>
                <Table.HeaderCell>Disciplina</Table.HeaderCell>
                <Table.HeaderCell>Departamento</Table.HeaderCell>
                <Table.HeaderCell>Fecha</Table.HeaderCell>
                <Table.HeaderCell>Estado</Table.HeaderCell>
                <Table.HeaderCell>Moderación</Table.HeaderCell>
                <Table.HeaderCell>Acciones</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {events.map((e) => (
                <Table.Row key={e.id}>
                  <Table.Cell>
                    {e.destacado && <Badge size="2xsmall" color="green">★</Badge>}{" "}
                    {e.titulo}
                  </Table.Cell>
                  <Table.Cell>{e.disciplina}</Table.Cell>
                  <Table.Cell>{e.departamento}</Table.Cell>
                  <Table.Cell>{fmt(e.fecha_inicio)}</Table.Cell>
                  <Table.Cell>{e.estado}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      size="2xsmall"
                      color={
                        e.moderacion === "aprobado"
                          ? "green"
                          : e.moderacion === "pendiente"
                            ? "orange"
                            : "red"
                      }
                    >
                      {e.moderacion}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      {e.moderacion !== "aprobado" && (
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => patch(e.id, { moderacion: "aprobado" })}
                        >
                          Aprobar
                        </Button>
                      )}
                      <Button
                        size="small"
                        variant="transparent"
                        onClick={() => patch(e.id, { destacado: !e.destacado })}
                      >
                        {e.destacado ? "Quitar ★" : "Destacar"}
                      </Button>
                      <Button
                        size="small"
                        variant="danger"
                        onClick={() => remove(e.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Agenda",
  icon: Calendar,
});

export default EventsPage;
