"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_auth_middleware_1 = __importDefault(require("../middlewares/user.auth.middleware"));
const profile_controller_1 = require("../controllers/profile.controller");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});
const profileRouter = express_1.default.Router();
profileRouter.get('/', user_auth_middleware_1.default, profile_controller_1.loadProfile);
profileRouter.put('/update', user_auth_middleware_1.default, upload.single("imageFile"), profile_controller_1.updateProfile);
exports.default = profileRouter;
