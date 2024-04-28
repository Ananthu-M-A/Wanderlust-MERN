"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_auth_middleware_1 = __importDefault(require("../middlewares/user.auth.middleware"));
const chat_controller_1 = require("../controllers/chat.controller");
const liveChatRouter = express_1.default.Router();
liveChatRouter.get('/', user_auth_middleware_1.default, chat_controller_1.startChat);
exports.default = liveChatRouter;
