import { Router } from "oak/mod.ts";
import userController from "../controllers/user.ts";

const router = new Router();
router.get("/users/:id", userController.getUser);
export default router;
