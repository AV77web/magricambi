import mysql, { type Pool, type PoolConnection, type PoolOptions } from "mysql2/promise";

declare global {
  var magRicambiMysqlPool: Pool | undefined;
}

function readEnv(name: string, fallback?: string): string {
  const value = process.env[name]?.trim();

  if (value) {
    return value;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  throw new Error(`Variabile ambiente mancante: ${name}`);
}

function readNumberEnv(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();

  if (!raw) {
    return fallback;
  }

  const value = Number(raw);

  if (!Number.isFinite(value)) {
    throw new Error(`Variabile ambiente non numerica: ${name}`);
  }

  return value;
}

function createPoolConfig(): PoolOptions {
  return {
    host: readEnv("MYSQL_HOST", "127.0.0.1"),
    port: readNumberEnv("MYSQL_PORT", 3306),
    user: readEnv("MYSQL_USER"),
    password: readEnv("MYSQL_PASSWORD"),
    database: readEnv("MYSQL_DATABASE"),
    waitForConnections: true,
    connectionLimit: readNumberEnv("MYSQL_CONNECTION_LIMIT", 10),
    queueLimit: 0,
    namedPlaceholders: true,
    timezone: "Z",
  };
}

function getPool(): Pool {
  if (!globalThis.magRicambiMysqlPool) {
    globalThis.magRicambiMysqlPool = mysql.createPool(createPoolConfig());
  }

  return globalThis.magRicambiMysqlPool;
}

export const db = new Proxy({} as Pool, {
  get(_target, property) {
    const pool = getPool();
    const value = Reflect.get(pool, property);

    if (typeof value === "function") {
      return value.bind(pool);
    }

    return value;
  },
});

export async function getDbConnection(): Promise<PoolConnection> {
  return getPool().getConnection();
}

export async function testDbConnection(): Promise<void> {
  const connection = await getDbConnection();

  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}
