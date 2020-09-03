"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = express_1.default();
// Routing
var routes_1 = __importDefault(require("./routes"));
app.use("/", routes_1.default);
app.listen(3000, function () {
    console.log("http://localhost:3000");
});
//# sourceMappingURL=server.js.map