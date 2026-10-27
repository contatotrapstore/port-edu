import 'server-only';
import { Pool } from 'pg';
let pool: Pool | undefined;
export function contentDb() {
  if (pool) return pool;
  const value=process.env.CONTENT_DATABASE_URL;
  if(!value) throw new Error('Content Studio database not configured');
  const url=new URL(value);
  for(const key of ['sslmode','sslcert','sslkey','sslrootcert'])url.searchParams.delete(key);
  pool=new Pool({connectionString:url.toString(),ssl:{rejectUnauthorized:true,ca:process.env.CONTENT_DATABASE_CA},max:3,connectionTimeoutMillis:10000,idleTimeoutMillis:10000,statement_timeout:15000});
  return pool;
}
