"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var mongoose_1 = require("mongoose");
var amqp = require("amqplib/callback_api");
var product_1 = require("./entities/product");
amqp.connect("amqps://sndgkkfu:ZbwVSLDLxDPv0YzW54fOKxtRATmmDd58@rattlesnake.rmq.cloudamqp.com/sndgkkfu", function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        channel.assertQueue("create_product", { durable: false });
        channel.assertQueue("product_updated", { durable: false });
        channel.assertQueue("product_deleted", { durable: false });
        var app = express();
        app.use(express.json());
        app.use(cors({ origin: ["http://localhost:3000"] }));
        var mongoDb_uri = "mongodb+srv://hassan:Hassan2019@hassancluster.4qgat.mongodb.net/test?retryWrites=true&w=majority";
        mongoose_1.default.connect(mongoDb_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        var db = mongoose_1.default.connection;
        db.on("error", function (error) {
            console.error("MongoDB connection error:", error);
        });
        db.once("open", function () {
            console.log("MONGODB CONNECTED SUCCESSFULLY.....");
        });
        db.on("disconnected", function () {
            console.log("MongoDB disconnected");
        });
        /////
        /////
        /////
        /////
        /////
        channel.consume("create_product", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
            var eventProduct, product;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eventProduct = JSON.parse(msg.content.toString());
                        return [4 /*yield*/, product_1.Product.create(__assign({ admin_id: eventProduct._id }, eventProduct))];
                    case 1:
                        product = _a.sent();
                        product
                            ? console.log("product created")
                            : console.log("product did not create");
                        return [2 /*return*/];
                }
            });
        }); }, { noAck: true });
        channel.consume("product_updated", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
            var eventProduct, product, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eventProduct = JSON.parse(msg.content.toString());
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, product_1.Product.findOneAndUpdate({ admin_id: eventProduct._id }, __assign({ admin_id: eventProduct._id }, eventProduct))];
                    case 2:
                        product = _a.sent();
                        product
                            ? console.log("product updated successfullyy")
                            : console.log("product did not updatee");
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        throw err_1;
                    case 4: return [2 /*return*/];
                }
            });
        }); }, { noAck: true });
        channel.consume("product_deleted", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
            var eventProduct, product, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eventProduct = JSON.parse(msg.content.toString());
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, product_1.Product.findOneAndDelete({
                                admin_id: eventProduct._id,
                            })];
                    case 2:
                        product = _a.sent();
                        product
                            ? console.log("product deleted successfullyy")
                            : console.log("product did not delete");
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        throw err_2;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        app.listen(5000, function (err) {
            err
                ? console.log(err)
                : console.log("MAIN-SERVER RUNNING ON PORT 5000");
        });
        process.on("beforeExit", function () {
            connection.close();
        });
    });
});
