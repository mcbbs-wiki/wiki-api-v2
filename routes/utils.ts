import { Router } from "oak/mod.ts";

const router = new Router();
router
  .get("/", (ctx) => {
    ctx.response.body = {
      status: "OK",
      document: "",
    };
  });
export default router;
