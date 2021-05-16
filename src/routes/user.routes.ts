import { Router } from "express";
import * as userCtrl from "./../controllers/user.controller";
import { auth } from "./../middlewares";

const router = Router();

router.post("/register", auth.checkDuplicatedUsernameEmail, userCtrl.register);
router.post("/login", userCtrl.login);

export default router;