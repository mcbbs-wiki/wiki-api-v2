import { connect } from "redis/mod.ts";
const cache = await connect({
  hostname: Deno.env.get("REDIS_HOSTNAME") as string,
  port: Deno.env.get("REDIS_PORT") as string,
  db: 1,
});
export default cache;
