import { Router } from "express";
import * as controller from "../controllers/product.controllers.js";
import { validate } from "../middlewares/validation.middleware.js";
import { productDto } from "../dtos/product.dto.js";
import { authorizations } from "../middlewares/authorization.middleware.js";
import passport from "passport";

const router = Router();

router.get("/", controller.getAll);

router.get("/:id", controller.getById);

router.post("/", passport.authenticate('jwt', {session: false}), authorizations(["admin"]), validate(productDto), controller.create);

router.put("/:id",passport.authenticate('jwt', {session: false}), authorizations(["admin"]), validate(productDto), controller.update);

router.delete("/:id", passport.authenticate('jwt', {session: false}), authorizations(["admin"]), validate(productDto), controller.remove);

export default router;
