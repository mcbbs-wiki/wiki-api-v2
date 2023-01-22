import { Router } from "oak/mod.ts";
import memeController from "../controllers/meme.ts";

const router = new Router();
router
  .get("/memes", memeController.getRandomMeme)
  .get("/memes/:id", memeController.getMeme)
  .get("/imgs", (c) => {
    c.response.status = 301;
    c.response.redirect("/913-api/memes");
  })
  .get("/imgs/:id", (c) => {
    c.response.status = 301;
    c.response.redirect(`/913-api/memes/${c.params.id}`);
  });
export default router;
