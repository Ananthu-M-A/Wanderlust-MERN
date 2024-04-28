"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const messageSocket_1 = __importDefault(require("./sockets/messageSocket"));
require("dotenv/config");
const MongoDB_1 = require("./utils/MongoDB");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const users_route_1 = __importDefault(require("./routes/users.route"));
const hotels_route_1 = __importDefault(require("./routes/hotels.route"));
const bookings_route_1 = __importDefault(require("./routes/bookings.route"));
const profile_route_1 = __importDefault(require("./routes/profile.route"));
const home_route_1 = __importDefault(require("./routes/home.route"));
const booking_route_1 = __importDefault(require("./routes/booking.route"));
const restaurants_route_1 = __importDefault(require("./routes/restaurants.route"));
const chat_route_1 = __importDefault(require("./routes/chat.route"));
(0, MongoDB_1.connectDb)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
(0, messageSocket_1.default)(server);
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "Secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 86400000,
    },
}));
app.use("/api/user", auth_route_1.default);
app.use("/api/user/profile", profile_route_1.default);
app.use("/api/user/home", home_route_1.default);
app.use("/api/user/booking", booking_route_1.default);
app.use("/api/user/live-chat", chat_route_1.default);
app.use("/api/admin", admin_route_1.default);
app.use("/api/admin/users", users_route_1.default);
app.use("/api/admin/hotels", hotels_route_1.default);
app.use("/api/admin/restaurants", restaurants_route_1.default);
app.use("/api/admin/bookings", bookings_route_1.default);
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
