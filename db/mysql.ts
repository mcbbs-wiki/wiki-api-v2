import { Client } from "mysql/mod.ts";
const client = await new Client();
client.connect({
  hostname: Deno.env.get("DATABASE_HOSTNAME"),
  username: Deno.env.get("DATABASE_USERNAME"),
  password: Deno.env.get("DATABASE_PASSWORD"),
  db: Deno.env.get("DATABASE_NAME"),
});
export default client;
