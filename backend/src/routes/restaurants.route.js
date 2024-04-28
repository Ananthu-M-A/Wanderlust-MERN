"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_auth_middleware_1 = __importDefault(require("../middlewares/admin.auth.middleware"));
const restaurants_controller_1 = require("../controllers/restaurants.controller");
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const restaurantsRouter = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});
restaurantsRouter.get('/', admin_auth_middleware_1.default, restaurants_controller_1.loadRestaurants);
restaurantsRouter.post('/create-restaurant', [
    (0, express_validator_1.body)("name").notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)("city").notEmpty().withMessage('City is required'),
    (0, express_validator_1.body)("country").notEmpty().withMessage('Country is required'),
    (0, express_validator_1.body)("description").notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)("type").notEmpty().withMessage('Type is required'),
    (0, express_validator_1.body)("facilities").notEmpty().isArray().withMessage('Facilities is required'),
], upload.array("imageFiles", 3), admin_auth_middleware_1.default, restaurants_controller_1.createRestaurant);
restaurantsRouter.get('/:restaurantId', admin_auth_middleware_1.default, restaurants_controller_1.loadRestaurant);
restaurantsRouter.put('/:restaurantId/update', upload.array("imageFiles"), admin_auth_middleware_1.default, restaurants_controller_1.updateRestaurant);
restaurantsRouter.put('/:restaurantId/block', admin_auth_middleware_1.default, restaurants_controller_1.blockRestaurant);
restaurantsRouter.put('/:restaurantId/unblock', admin_auth_middleware_1.default, restaurants_controller_1.unblockRestaurant);
exports.default = restaurantsRouter;
