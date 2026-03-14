const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

function createPool() {
  return new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'denovonomo',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function getExecutedMigrations(client) {
  const result = await client.query(
    'SELECT filename FROM schema_migrations ORDER BY filename'
  );
  return new Set(result.rows.map((row) => row.filename));
}

function getMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return [];
  }
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();
}

async function runMigrations(pool) {
  const ownPool = !pool;
  if (!pool) {
    pool = createPool();
  }

  const client = await pool.connect();
  try {
    await ensureMigrationsTable(client);
    const executed = await getExecutedMigrations(client);
    const files = getMigrationFiles();
    const pending = files.filter((f) => !executed.has(f));

    if (pending.length === 0) {
      console.log('No pending migrations.');
      return { executed: 0, files: [] };
    }

    console.log(`Found ${pending.length} pending migration(s).`);

    for (const file of pending) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      console.log(`Running migration: ${file}`);
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1)',
          [file]
        );
        await client.query('COMMIT');
        console.log(`Completed migration: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`Failed migration: ${file}`);
        console.error(err.message);
        throw err;
      }
    }

    console.log(`Successfully ran ${pending.length} migration(s).`);
    return { executed: pending.length, files: pending };
  } finally {
    client.release();
    if (ownPool) {
      await pool.end();
    }
  }
}

// Run directly if invoked as a script
if (require.main === module) {
  runMigrations()
    .then((result) => {
      console.log('Migration complete.', result);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed:', err.message);
      process.exit(1);
    });
}

module.exports = { runMigrations };
