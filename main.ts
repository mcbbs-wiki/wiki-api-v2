import "std/dotenv/load.ts";
/// <reference types="./types.d.ts" />
import {
  Application,
  Context,
  isHttpError,
  Status,
  STATUS_TEXT,
} from "oak/mod.ts";
import { green, yellow } from "std/fmt/colors.ts";
import memeRouter from "./routes/meme.ts";
import userRouter from "./routes/user.ts";
import utilsRouter from "./routes/utils.ts";
import { Accepts } from "accepts/mod.ts";

const app = new Application();
const port = 8080;

app.use(async (ctx: Context, next) => {
  ctx.response.headers.append('Access-Control-Allow-Origin', '*')
  ctx.accepts = new Accepts(ctx.request.headers);
  await next();
});
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      switch (err.status) {
        case Status.NotFound:
          ctx.response.body = { message: STATUS_TEXT[404] };
          break;
        case Status.InternalServerError:
          ctx.response.body = { message: STATUS_TEXT[500] };
          break;
        default:
      }
    } else {
      throw err;
    }
  }
});
app.use(memeRouter.routes());
app.use(userRouter.routes());
app.use(utilsRouter.routes());
app.use((ctx) => {
  ctx.throw(404);
});
app.addEventListener("listen", ({ secure, hostname, port }) => {
  const protocol = secure ? "https://" : "http://";
  const url = `${protocol}${hostname ?? "localhost"}:${port}`;
  console.log(`${yellow("Listening on:")} ${green(url)}`);
});
await app.listen({ port });
