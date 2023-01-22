import { RouterContext } from "oak/mod.ts";
import MemeModel from "../models/meme.ts";
import { randomInt } from "../utils.ts";

export default {
  getRandomMeme: async (ctx: RouterContext<"/memes">) => {
    const imgid = randomInt(1, MemeModel.imgCount);
    const img = await MemeModel.getById(imgid);
    const type = ctx.accepts.types(["webp", "html", "json"]);
    if (img) {
      switch (type) {
        case "webp":
          ctx.response.redirect(img.path);
          break;
        case "json":
          ctx.response.status = 200;
          ctx.response.body = img;
          break;
        default:
          ctx.response.redirect(img.path);
      }
    } else {
      ctx.throw(404);
    }
  },
  getMeme: async (ctx: RouterContext<"/memes/:id">) => {
    const imgid = parseInt(ctx.params.id);
    if (isNaN(imgid)) {
      ctx.throw(400);
    }
    const type = ctx.accepts.types(["webp", "html", "json"]);
    const img = await MemeModel.getById(imgid);
    if (img) {
      switch (type) {
        case "webp":
          ctx.response.redirect(img.path);
          break;
        case "json":
          ctx.response.status = 200;
          ctx.response.body = img;
          break;
        default:
          ctx.response.redirect(img.path);
      }
    } else {
      ctx.throw(404);
    }
  },
};
