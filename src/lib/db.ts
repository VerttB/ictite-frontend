import { Pool } from "pg";

const {
  POSTGRES_USER,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
  POSTGRES_PORT,
} = process.env;

if (
  !POSTGRES_USER ||
  !POSTGRES_HOST ||
  !POSTGRES_PASSWORD ||
  !POSTGRES_DATABASE ||
  !POSTGRES_PORT
) {
  throw new Error("Faltam as variáveis de ambiente");
}

export const pool = new Pool({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DATABASE,
  password: POSTGRES_PASSWORD,
  port: Number(POSTGRES_PORT),
});
