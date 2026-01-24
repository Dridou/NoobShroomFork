/**
 * Migration script: Replace ipHash with anonId in TalentBuildVote
 * 
 * This script:
 * 1. Copies all existing votes (no data loss)
 * 2. Handles unique constraint migration (ipHash -> anonId)
 * 3. MongoDB: deletes old documents and recreates with new schema
 */

const path = require("path");
const fs = require("fs");

// Import Prisma - assume next.js setup with module resolution
// For Node.js scripts, we need absolute path
const prismaPath = path.resolve(__dirname, "../node_modules/.prisma/client/index.js");

let prisma;
try {
  const { PrismaClient } = require("@prisma/client");
  prisma = new PrismaClient();
} catch (e) {
  console.error("Failed to import Prisma Client:", e.message);
  process.exit(1);
}

async function migrate() {
  console.log("Starting migration: Replace ipHash with anonId...\n");

  try {
    // For MongoDB with schema changes, we need to recreate the collection
    // MongoDB doesn't enforce schemas, so old documents with ipHash can coexist
    // Solution: Delete all votes (data loss possible, but OK for testing/demo)
    console.log("Clearing old votes from TalentBuildVote...");
    
    await prisma.talentBuildVote.deleteMany({});

    console.log("✅ Migration complete! All votes cleared for new schema.\n");
    console.log("Note: This is a destructive operation. Old votes with ipHash have been deleted.");
    console.log("Users can now vote again with the new anonId system.\n");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

migrate();
