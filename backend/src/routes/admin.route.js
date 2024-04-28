"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_auth_middleware_1 = __importDefault(require("../middlewares/admin.auth.middleware"));
const admin_controller_1 = require("../controllers/admin.controller");
const FormValidator_1 = require("../utils/FormValidator");
const adminRouter = express_1.default.Router();
adminRouter.post("/login", FormValidator_1.validateLogin, admin_controller_1.adminLogin);
adminRouter.get("/validate-token", admin_auth_middleware_1.default, admin_controller_1.adminAuthorization);
adminRouter.post("/logout", admin_controller_1.adminLogout);
exports.default = adminRouter;
