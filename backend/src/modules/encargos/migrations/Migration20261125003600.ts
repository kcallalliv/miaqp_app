import { Migration } from '@mikro-orm/migrations';

export class Migration20261125003600 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "cavi_encargo" ("id" text not null, "titulo" text not null, "categoria" text check ("categoria" in ('running', 'triatlon', 'natacion', 'ciclismo', 'zapatillas', 'ropa', 'tecnologia', 'nutricion', 'otro')) not null default 'otro', "marca" text null, "descripcion" text null, "imagen_url" text null, "precio_usa" integer not null default 0, "precio_peru_aprox" integer null, "comision" integer not null default 0, "precio_final" integer not null default 0, "cupos_total" integer not null default 1, "cupos_reservados" integer not null default 0, "fecha_limite" timestamptz null, "destacado" boolean not null default false, "activo" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cavi_encargo_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cavi_encargo_deleted_at" ON "cavi_encargo" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cavi_encargo_categoria" ON "cavi_encargo" (categoria) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cavi_encargo_activo" ON "cavi_encargo" (activo) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "cavi_encargo" cascade;`);
  }

}
