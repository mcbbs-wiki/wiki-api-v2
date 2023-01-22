import { RouterContext } from "oak/mod.ts";
import { getUser } from "../models/user.ts";

export default {
  getUser: async (ctx: RouterContext<"/users/:id">) => {
    const userid: number = parseInt(ctx.params.id);
    if (isNaN(userid)) {
      ctx.throw(400);
    }
    const info = await getUser(userid);
    if (info) {
      ctx.response.status = 200;
      ctx.response.body = info;
    } else {
      ctx.throw(404);
    }
  },
};
