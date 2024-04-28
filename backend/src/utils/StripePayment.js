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
exports.retrievePaymentId = exports.sessionPayment = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_API_KEY);
const sessionPayment = (req, res, name, description, unit_amount, quantity, success_url, cancel_url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookingData = [{
                price_data: {
                    currency: "inr",
                    product_data: { name, description },
                    unit_amount,
                },
                quantity,
            }];
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: bookingData,
            mode: "payment",
            success_url, cancel_url,
        });
        res.json({ id: session.id });
    }
    catch (error) {
        console.log("Error in creating session payment", error);
    }
});
exports.sessionPayment = sessionPayment;
const retrievePaymentId = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield stripe.checkout.sessions.retrieve(sessionId);
        const paymentIntentId = session.payment_intent;
        return paymentIntentId;
    }
    catch (error) {
        console.log("Error retrieving payment id", error);
    }
});
exports.retrievePaymentId = retrievePaymentId;
