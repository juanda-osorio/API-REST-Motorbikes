import { Router } from "express";
import * as motosCtrl from "./../controllers/motos.controller";
import { auth } from "./../middlewares";

const router = Router();

router.get("/", motosCtrl.getMotos);
router.get("/search", motosCtrl.searchMotos);
router.post("/",          [auth.verifyToken, auth.isAdmin], motosCtrl.insertMoto);
router.put("/:idMoto",    [auth.verifyToken, auth.isAdmin], motosCtrl.updateMoto);
router.delete("/:idMoto", [auth.verifyToken, auth.isAdmin], motosCtrl.deleteMoto);

export default router;
