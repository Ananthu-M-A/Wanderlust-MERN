"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("../controllers/users.controller");
const admin_auth_middleware_1 = __importDefault(require("../middlewares/admin.auth.middleware"));
const usersRouter = express_1.default.Router();
usersRouter.get('/', admin_auth_middleware_1.default, users_controller_1.loadUsers);
usersRouter.put('/:userId/block', admin_auth_middleware_1.default, users_controller_1.blockUser);
usersRouter.put('/:userId/unblock', admin_auth_middleware_1.default, users_controller_1.unblockUser);
exports.default = usersRouter;
