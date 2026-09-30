import { Migration } from '@mikro-orm/migrations';

export class Migration20260930182538 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "cavi_reclamo" drop constraint if exists "cavi_reclamo_correlativo_unique";`);
    this.addSql(`create table if not exists "cavi_reclamo" ("id" text not null, "correlativo" text not null, "tipo" text check ("tipo" in ('reclamo', 'queja')) not null default 'reclamo', "tipo_bien" text check ("tipo_bien" in ('producto', 'servicio')) not null default 'producto', "nombre" text not null, "tipo_documento" text check ("tipo_documento" in ('DNI', 'CE', 'PASAPORTE', 'RUC')) not null default 'DNI', "numero_documento" text not null, "email" text not null, "telefono" text null, "domicilio" text null, "pedido_id" text null, "monto_reclamado" integer null, "descripcion_bien" text null, "detalle" text not null, "pedido_consumidor" text null, "estado" text check ("estado" in ('pendiente', 'respondido')) not null default 'pendiente', "respuesta" text null, "respondido_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cavi_reclamo_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cavi_reclamo_correlativo_unique" ON "cavi_reclamo" (correlativo) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cavi_reclamo_deleted_at" ON "cavi_reclamo" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cavi_reclamo_estado" ON "cavi_reclamo" (estado) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cavi_reclamo_numero_documento" ON "cavi_reclamo" (numero_documento) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "cavi_reclamo" cascade;`);
  }

}
