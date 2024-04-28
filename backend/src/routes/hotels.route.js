"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_auth_middleware_1 = __importDefault(require("../middlewares/admin.auth.middleware"));
const hotels_controller_1 = require("../controllers/hotels.controller");
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const hotelsRouter = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});
hotelsRouter.get('/', admin_auth_middleware_1.default, hotels_controller_1.loadHotels);
hotelsRouter.post('/create-hotel', [
    (0, express_validator_1.body)("name").notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)("city").notEmpty().withMessage('City is required'),
    (0, express_validator_1.body)("country").notEmpty().withMessage('Country is required'),
    (0, express_validator_1.body)("description").notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)("type").notEmpty().withMessage('Type is required'),
    (0, express_validator_1.body)("facilities").notEmpty().isArray().withMessage('Facilities is required'),
], upload.array("imageFiles", 3), admin_auth_middleware_1.default, hotels_controller_1.createHotel);
hotelsRouter.get('/:hotelId', admin_auth_middleware_1.default, hotels_controller_1.loadHotel);
hotelsRouter.put('/:hotelId/update', upload.array("imageFiles"), admin_auth_middleware_1.default, hotels_controller_1.updateHotel);
hotelsRouter.put('/:hotelId/block', admin_auth_middleware_1.default, hotels_controller_1.blockHotel);
hotelsRouter.put('/:hotelId/unblock', admin_auth_middleware_1.default, hotels_controller_1.unblockHotel);
exports.default = hotelsRouter;
