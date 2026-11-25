import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Container,
  Heading,
  Text,
  Badge,
  Table,
  Button,
  Input,
  Label,
  Select,
  Checkbox,
  Textarea,
  toast,
} from "@medusajs/ui";
import { useEffect, useState } from "react";
import { CATEGORIAS_ENCARGO } from "../../../modules/encargos/constants";

interface Encargo {
  id: string;
  titulo: string;
  categoria: string;
  marca?: string | null;
  precio_usa: number;
  precio_peru_aprox?: number | null;
  comision: number;
  precio_final: number;
  cupos_total: number;
  cupos_reservados: number;
  destacado: boolean;
  activo: boolean;
}

const empty = {
  titulo: "",
  categoria: "zapatillas",
  marca: "",
  descripcion: "",
  imagen_url: "",
  precio_usa: "",
  precio_peru_aprox: "",
  comision: "",
  precio_final: "",
  cupos_total: "3",
  fecha_limite: "",
  destacado: false,
};

const EncargosPage = () => {
  const [items, setItems] = useState<Encargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/admin/encargos", { credentials: "include" });
      const data = await res.json();
      setItems(data.encargos ?? []);
    } catch {
      toast.error("No se pudo cargar");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function create() {
    if (form.titulo.trim().length < 3 || !form.precio_final) {
      toast.error("Título y precio final son obligatorios");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/admin/encargos", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Encargo creado");
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
      const res = await fetch(`/admin/encargos/${id}`, {
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
    if (!confirm("¿Eliminar este encargo?")) return;
    await fetch(`/admin/encargos/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    load();
  }

  const set = (k: string, v: unknown) => setForm({ ...form, [k]: v });

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Encargos USA</Heading>
          <Text className="text-ui-fg-subtle mt-1 text-sm">
            Productos que traes del viaje · cupos limitados · 50% adelanto / 50% entrega
          </Text>
        </div>
        <Button variant="secondary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cerrar" : "Nuevo encargo"}
        </Button>
      </div>

      {showForm && (
        <div className="grid grid-cols-2 gap-3 px-6 py-4">
          <div className="col-span-2">
            <Label>Título</Label>
            <Input value={form.titulo} onChange={(e) => set("titulo", e.target.value)} />
          </div>
          <div>
            <Label>Categoría</Label>
            <Select value={form.categoria} onValueChange={(v) => set("categoria", v)}>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {CATEGORIAS_ENCARGO.map((c) => (
                  <Select.Item key={c} value={c}>
                    {c}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          <div>
            <Label>Marca</Label>
            <Input value={form.marca} onChange={(e) => set("marca", e.target.value)} />
          </div>
          <div>
            <Label>Precio USA (USD)</Label>
            <Input type="number" value={form.precio_usa} onChange={(e) => set("precio_usa", e.target.value)} />
          </div>
          <div>
            <Label>Precio aprox. en Perú (PEN)</Label>
            <Input type="number" value={form.precio_peru_aprox} onChange={(e) => set("precio_peru_aprox", e.target.value)} />
          </div>
          <div>
            <Label>Comisión (PEN)</Label>
            <Input type="number" value={form.comision} onChange={(e) => set("comision", e.target.value)} />
          </div>
          <div>
            <Label>Precio final al cliente (PEN)</Label>
            <Input type="number" value={form.precio_final} onChange={(e) => set("precio_final", e.target.value)} />
          </div>
          <div>
            <Label>Cupos</Label>
            <Input type="number" value={form.cupos_total} onChange={(e) => set("cupos_total", e.target.value)} />
          </div>
          <div>
            <Label>Reservar hasta</Label>
            <Input type="date" value={form.fecha_limite} onChange={(e) => set("fecha_limite", e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>Imagen (URL)</Label>
            <Input value={form.imagen_url} onChange={(e) => set("imagen_url", e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>Descripción</Label>
            <Textarea rows={2} value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <Checkbox checked={form.destacado} onCheckedChange={(v) => set("destacado", !!v)} />
            <Label>Destacado</Label>
          </div>
          <div className="col-span-2">
            <Button onClick={create} isLoading={saving}>
              Crear encargo
            </Button>
          </div>
        </div>
      )}

      <div className="px-6 py-2">
        {loading ? (
          <Text className="text-ui-fg-subtle py-6 text-sm">Cargando…</Text>
        ) : items.length === 0 ? (
          <Text className="text-ui-fg-subtle py-6 text-sm">Aún no hay encargos.</Text>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Producto</Table.HeaderCell>
                <Table.HeaderCell>Final (PEN)</Table.HeaderCell>
                <Table.HeaderCell>Comisión</Table.HeaderCell>
                <Table.HeaderCell>Cupos</Table.HeaderCell>
                <Table.HeaderCell>Estado</Table.HeaderCell>
                <Table.HeaderCell>Acciones</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.map((e) => {
                const disp = Math.max(0, e.cupos_total - e.cupos_reservados);
                return (
                  <Table.Row key={e.id}>
                    <Table.Cell>
                      {e.destacado && <Badge size="2xsmall" color="green">★</Badge>} {e.titulo}
                      <span className="text-ui-fg-muted block text-xs">{e.marca} · {e.categoria}</span>
                    </Table.Cell>
                    <Table.Cell>S/ {e.precio_final}</Table.Cell>
                    <Table.Cell>S/ {e.comision}</Table.Cell>
                    <Table.Cell>
                      {e.cupos_reservados}/{e.cupos_total}
                      <span className="text-ui-fg-muted block text-xs">{disp} libres</span>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge size="2xsmall" color={!e.activo ? "grey" : disp <= 0 ? "red" : "green"}>
                        {!e.activo ? "inactivo" : disp <= 0 ? "agotado" : "disponible"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-wrap gap-2">
                        <Button size="small" variant="secondary" onClick={() => patch(e.id, { cupos_reservados: e.cupos_reservados + 1 })} disabled={disp <= 0}>
                          +1 reserva
                        </Button>
                        <Button size="small" variant="transparent" onClick={() => patch(e.id, { cupos_reservados: Math.max(0, e.cupos_reservados - 1) })}>
                          −1
                        </Button>
                        <Button size="small" variant="transparent" onClick={() => patch(e.id, { activo: !e.activo })}>
                          {e.activo ? "Ocultar" : "Activar"}
                        </Button>
                        <Button size="small" variant="danger" onClick={() => remove(e.id)}>
                          Eliminar
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        )}
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({ label: "Encargos USA" });

export default EncargosPage;
