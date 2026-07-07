import sql from "mssql";

/**
 * Singleton MSSQL connection pool.
 *
 * Usage:
 *   const pool = await getPool();
 *   const result = await pool.request().query("SELECT ...");
 *
 * The pool is created once and reused across all Server Component / Server
 * Action invocations within the same Node process (hot-reload safe via
 * globalThis cache).
 */

const config: sql.config = {
  server: process.env.DB_HOST ?? "localhost",
  port: parseInt(process.env.DB_PORT ?? "1433", 10),
  user: process.env.DB_USERNAME ?? "sa",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "MES_2026",
  options: {
    encrypt: false, // local dev — no TLS
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Persist across hot reloads in dev
const globalForDb = globalThis as unknown as {
  _mssqlPool: sql.ConnectionPool | undefined;
  _mssqlPoolPromise: Promise<sql.ConnectionPool> | undefined;
};

export async function getPool(): Promise<sql.ConnectionPool> {
  if (globalForDb._mssqlPool?.connected) {
    return globalForDb._mssqlPool;
  }

  if (!globalForDb._mssqlPoolPromise) {
    globalForDb._mssqlPoolPromise = new sql.ConnectionPool(config)
      .connect()
      .then((pool) => {
        globalForDb._mssqlPool = pool;
        console.log("[DB] Connected to MSSQL:", process.env.DB_NAME);
        return pool;
      })
      .catch((err) => {
        globalForDb._mssqlPoolPromise = undefined;
        throw err;
      });
  }

  return globalForDb._mssqlPoolPromise;
}

export { sql };
