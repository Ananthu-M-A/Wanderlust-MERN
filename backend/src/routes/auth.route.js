"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const user_auth_middleware_1 = __importDefault(require("../middlewares/user.auth.middleware"));
const FormValidator_1 = require("../utils/FormValidator");
const authRouter = express_1.default.Router();
authRouter.post("/register", FormValidator_1.validateRegister, auth_controller_1.userRegistration);
authRouter.post("/verify-registration", auth_controller_1.verifyRegistration);
authRouter.post("/login", FormValidator_1.validateLogin, auth_controller_1.userLogin);
authRouter.get("/validate-token", user_auth_middleware_1.default, auth_controller_1.userAuthorization);
authRouter.post("/logout", auth_controller_1.userLogout);
authRouter.post("/reset-password", FormValidator_1.validateLogin, auth_controller_1.resetPassword);
authRouter.post("/verify-reset-password", auth_controller_1.verifyResetPassword);
authRouter.get('/load-user', user_auth_middleware_1.default, auth_controller_1.loadUser);
exports.default = authRouter;
