import { Router } from "express";
import UserController from "../controllers/UserController.js";

const routeUser = new Router()

routeUser.post("/registration", UserController.registration)
routeUser.post("/login", UserController.login)

export default routeUser

