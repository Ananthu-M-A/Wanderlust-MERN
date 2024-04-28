"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unblockUser = exports.blockUser = exports.loadUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const loadUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = constructSearchQuery(req.query);
        const pageSize = 10;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;
        const users = yield user_model_1.default.find(query).skip(skip).limit(pageSize);
        const total = yield user_model_1.default.countDocuments(Object.assign(Object.assign({}, query), { isBlocked: false }));
        const response = {
            data: users,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            }
        };
        res.json(response);
    }
    catch (error) {
        console.log("Error in loading users table", error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});
exports.loadUsers = loadUsers;
const blockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const users = (yield user_model_1.default.findOneAndUpdate({ _id: userId }, { isBlocked: true }, { new: true }));
        res.json(users);
    }
    catch (error) {
        console.log("Error in blocking user", error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});
exports.blockUser = blockUser;
const unblockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const users = (yield user_model_1.default.findOneAndUpdate({ _id: userId }, { isBlocked: false }, { new: true }));
        res.json(users);
    }
    catch (error) {
        console.log("Error in unblocking user", error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});
exports.unblockUser = unblockUser;
const constructSearchQuery = (queryParams) => {
    let constructedQuery = {};
    if (queryParams.destination) {
        constructedQuery.$or = [
            { name: new RegExp(queryParams.destination, "i") },
            { email: new RegExp(queryParams.destination, "i") },
            { mobile: new RegExp(queryParams.destination, "i") },
        ];
    }
    return constructedQuery;
};
