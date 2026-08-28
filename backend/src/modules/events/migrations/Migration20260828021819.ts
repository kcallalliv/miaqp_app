import { Migration } from '@mikro-orm/migrations';

export class Migration20260828021819 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "cavi_event" ("id" text not null, "titulo" text not null, "disciplina" text check ("disciplina" in ('trail', 'triatlon', 'ruta', 'aguas_abiertas', 'ciclismo', 'otro')) not null default 'otro', "fecha_inicio" timestamptz not null, "fecha_fin" timestamptz null, "departamento" text check ("departamento" in ('Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca', 'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad', 'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali')) not null, "ciudad" text null, "distancias" text null, "organizador" text null, "url_inscripcion" text null, "imagen_url" text null, "fuente" text null, "estado" text check ("estado" in ('proximo', 'inscripciones_abiertas', 'agotado', 'finalizado')) not null default 'proximo', "destacado" boolean not null default false, "moderacion" text check ("moderacion" in ('aprobado', 'pendiente', 'rechazado')) not null default 'aprobado', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cavi_event_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cavi_event_deleted_at" ON "cavi_event" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cavi_event_departamento" ON "cavi_event" (departamento) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cavi_event_disciplina" ON "cavi_event" (disciplina) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cavi_event_fecha_inicio" ON "cavi_event" (fecha_inicio) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "cavi_event" cascade;`);
  }

}
