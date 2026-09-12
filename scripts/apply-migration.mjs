// Script para aplicar la migración manualmente sin el migration engine
// Ejecutar con: node scripts/apply-migration.mjs

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Aplicando migración manualmente...");

  // Verificar si la columna costPrice ya existe
  try {
    await prisma.$queryRawUnsafe(`SELECT costPrice FROM "Product" LIMIT 1`);
    console.log("✅ Columna costPrice ya existe.");
  } catch {
    console.log("➕ Añadiendo columna costPrice a Product...");
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "Product" ADD COLUMN "costPrice" REAL NOT NULL DEFAULT 0`
    );
    console.log("✅ Columna costPrice añadida.");
  }

  // Verificar si la tabla Payment ya existe
  try {
    await prisma.$queryRawUnsafe(`SELECT id FROM "Payment" LIMIT 1`);
    console.log("✅ Tabla Payment ya existe.");
  } catch {
    console.log("➕ Creando tabla Payment...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Payment" (
        "id"        TEXT NOT NULL PRIMARY KEY,
        "orderId"   TEXT NOT NULL UNIQUE,
        "method"    TEXT NOT NULL,
        "amount"    REAL NOT NULL,
        "reference" TEXT NOT NULL DEFAULT '',
        "status"    TEXT NOT NULL DEFAULT 'Pendiente',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tabla Payment creada.");
  }

  // Marcar migración como aplicada en _prisma_migrations si no está
  try {
    await prisma.$executeRawUnsafe(`
      INSERT OR IGNORE INTO "_prisma_migrations"
        (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
      VALUES
        ('manual-fix-001', 'manual', datetime('now'), '20260608060311_', NULL, NULL, datetime('now'), 1)
    `);
  } catch {
    // Tabla _prisma_migrations puede no existir si nunca se corrió una migración exitosa
  }

  console.log("\n✅ Migración aplicada exitosamente.");
  console.log("👉 Ahora ejecuta: npm exec prisma -- db seed");
}

main()
  .catch((e) => { console.error("❌ Error:", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
