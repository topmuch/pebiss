import { join, dirname } from 'path';
import { mkdirSync, existsSync, cpSync, readdirSync, statSync } from 'fs';

/**
 * Resolve the persistent uploads directory.
 *
 * In production (Docker/Coolify):
 *   DATABASE_URL = file:/app/data/pebiss.db
 *   → uploads stored at <cwd>/db/uploads/  (same volume as DB)
 *
 * In development:
 *   DATABASE_URL = file:./db/custom.db
 *   → uploads stored at <cwd>/db/uploads/
 *
 * This ensures images survive container restarts because they share
 * the same persistent volume as the SQLite database.
 */
function resolveUploadsDir(): string {
  const dbUrl = process.env.DATABASE_URL || 'file:./db/custom.db';
  const dbPath = dbUrl.replace(/^file:/, '');
  const dataDir = dirname(dbPath);
  return join(process.cwd(), dataDir, 'uploads');
}

let _uploadsDir: string | null = null;

export function getUploadsDir(): string {
  if (!_uploadsDir) {
    _uploadsDir = resolveUploadsDir();
    // Ensure directory exists
    if (!existsSync(_uploadsDir)) {
      mkdirSync(_uploadsDir, { recursive: true });
    }
  }
  return _uploadsDir;
}

/**
 * One-time migration: copy uploads from old location to new persistent location.
 * Called once at server startup. Does nothing if source doesn't exist or is empty.
 */
export function migrateOldUploads(): void {
  const newDir = getUploadsDir();
  const oldDir = join(process.cwd(), 'uploads');

  // Skip if old dir doesn't exist
  if (!existsSync(oldDir)) return;

  // Read contents of both directories
  let oldFiles: string[] = [];
  let newFiles: string[] = [];
  try {
    oldFiles = readdirSync(oldDir);
    newFiles = existsSync(newDir) ? readdirSync(newDir) : [];
  } catch {
    return;
  }

  if (oldFiles.length === 0 || newFiles.length > 0) return;

  try {
    for (const file of oldFiles) {
      const src = join(oldDir, file);
      const dst = join(newDir, file);
      if (statSync(src).isFile()) {
        cpSync(src, dst);
        console.log(`[migrate] Copied ${file} → persistent uploads`);
      }
    }
    console.log(`[migrate] ✅ Migrated ${oldFiles.length} files to persistent storage`);
  } catch (err) {
    console.error('[migrate] Error migrating uploads:', err);
  }
}
