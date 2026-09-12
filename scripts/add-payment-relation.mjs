import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  try {
    // Add address column to Customer if not exists
    await prisma.$executeRawUnsafe(`ALTER TABLE Customer ADD COLUMN address TEXT NOT NULL DEFAULT ''`);
    console.log("✅ Customer.address added");
  } catch (e) {
    if (e.message?.includes("duplicate column")) {
      console.log("ℹ️  Customer.address already exists");
    } else {
      console.error("Customer.address error:", e.message);
    }
  }

  // Payment.orderId is currently UNIQUE — need to drop that constraint
  // In SQLite we need to recreate the table to remove UNIQUE
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS Payment_new (
        id TEXT PRIMARY KEY,
        orderId TEXT NOT NULL,
        method TEXT NOT NULL,
        amount REAL NOT NULL,
        reference TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'Pendiente',
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (orderId) REFERENCES "Order"(id)
      )
    `);
    // Copy existing data
    await prisma.$executeRawUnsafe(`INSERT OR IGNORE INTO Payment_new SELECT id, orderId, method, amount, reference, status, createdAt FROM Payment`);
    await prisma.$executeRawUnsafe(`DROP TABLE Payment`);
    await prisma.$executeRawUnsafe(`ALTER TABLE Payment_new RENAME TO Payment`);
    console.log("✅ Payment table updated (removed UNIQUE on orderId, added FK)");
  } catch (e) {
    console.error("Payment table error:", e.message);
  }

  await prisma.$disconnect();
  console.log("Done.");
}

main().catch(console.error);
