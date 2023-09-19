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
var morgan = require("morgan");
var Product_schema_1 = require("./entity/Product.schema");
amqp.connect("amqps://sndgkkfu:ZbwVSLDLxDPv0YzW54fOKxtRATmmDd58@rattlesnake.rmq.cloudamqp.com/sndgkkfu", function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var app = express();
        app.use(express.json());
        app.use(cors({ origin: ["http://localhost:3000"] }));
        app.use(morgan("dev"));
        var MONGODB_URI = "mongodb+srv://Hamannn:Hassan2019@cluster0.l2mxsax.mongodb.net/test?retryWrites=true&w=majority";
        mongoose_1.default
            .connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(function () {
            console.log("Connected to MongoDB");
        })
            .catch(function (error) {
            console.error("Error connecting to MongoDB:", error);
        });
        /////
        /////
        /////
        /////
        /////
        //CRUD FUNCTIONALITIES
        //CREATE
        app.post("/product/add", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var product, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!req.body) {
                            return [2 /*return*/, res.status(400).json({
                                    status: "Failed",
                                    message: "add your body",
                                })];
                        }
                        console.log(req.body);
                        return [4 /*yield*/, Product_schema_1.Product.create(req.body)];
                    case 1:
                        product = _a.sent();
                        channel.sendToQueue("create_product", Buffer.from(JSON.stringify(product)));
                        return [2 /*return*/, res.status(201).json({
                                status: "Success",
                                data: { product: product },
                            })];
                    case 2:
                        err_1 = _a.sent();
                        res.status(400).json({
                            status: "failedd",
                            error: err_1,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        //READ
        app.get("/product/get", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var query, products, title, id, que, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = req.query;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        products = void 0;
                        if (!!query) return [3 /*break*/, 3];
                        return [4 /*yield*/, Product_schema_1.Product.find()];
                    case 2:
                        products = _a.sent();
                        return [2 /*return*/, res.status(201).json({
                                status: "Success",
                                data: { products: products },
                            })];
                    case 3:
                        title = void 0, id = void 0, que = void 0;
                        query.title || query.id
                            ? (que = query.title || query.id)
                            : (title = query.title),
                            (id = query.id);
                        return [4 /*yield*/, Product_schema_1.Product.find({ que: que })];
                    case 4:
                        products =
                            (_a.sent()) || Product_schema_1.Product.find({ title: title, id: id });
                        return [3 /*break*/, 6];
                    case 5:
                        err_2 = _a.sent();
                        res.status(400).json({
                            status: "failed",
                            error: err_2,
                        });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
        //READ ONE
        app.get("/product/get/:getParam", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var queryParam, product, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryParam = req.params.getParam;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Product_schema_1.Product.findOne({ title: queryParam })];
                    case 2:
                        product = _a.sent();
                        product
                            ? res.status(200).json({ status: "Success", product: product })
                            : res.status(404).json({
                                status: "Failed",
                                message: "Failed To Find These product",
                                product: product,
                            });
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        return [2 /*return*/, res.status(400).json({
                                status: "ERROR",
                                Error: err_3,
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        //UPDATE
        app.patch("/product/update/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var param, body, product, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param = req.params.id;
                        body = req.body;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Product_schema_1.Product.findOneAndUpdate({ _id: param }, body)];
                    case 2:
                        product = _a.sent();
                        if (product) {
                            channel.sendToQueue("product_updated", Buffer.from(JSON.stringify(product)));
                            return [2 /*return*/, res.status(201).json({
                                    status: "Successful",
                                    product: product,
                                })];
                        }
                        return [2 /*return*/, res.status(400).json({ status: "Failed", product: product })];
                    case 3:
                        err_4 = _a.sent();
                        return [2 /*return*/, res.status(400).json({
                                status: "Failed",
                                ERROR: err_4,
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        //DELETE
        app.delete("/product/delete/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var param, product, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param = req.params.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Product_schema_1.Product.findByIdAndDelete({ _id: param })];
                    case 2:
                        product = _a.sent();
                        if (product) {
                            channel.sendToQueue("product_deleted", Buffer.from(JSON.stringify(product)));
                            return [2 /*return*/, res.status(201).json({
                                    status: "Successful",
                                    product: product,
                                })];
                        }
                        return [2 /*return*/, res.status(400).json({ status: "Failed", product: product })];
                    case 3:
                        err_5 = _a.sent();
                        return [2 /*return*/, res.status(400).json({
                                status: "Failed",
                                ERROR: err_5,
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        //LIKES
        app.post("/product/like/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var param, product, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param = req.params.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, Product_schema_1.Product.findOne({ _id: param })];
                    case 2:
                        product = _a.sent();
                        if (!product) return [3 /*break*/, 4];
                        product.likes += 1;
                        return [4 /*yield*/, product.save()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, res.status(201).json({
                                status: "Successful",
                                product: product,
                            })];
                    case 4: return [2 /*return*/, res.status(400).json({ status: "Failed", product: product })];
                    case 5:
                        err_6 = _a.sent();
                        return [2 /*return*/, res.status(400).json({
                                status: "Failed",
                                ERROR: err_6,
                            })];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
        //GET QUERY PARAMETERS
        /////
        /////
        /////
        /////
        /////
        app.listen(4080, function (err) {
            err
                ? console.log(err)
                : console.log("ADMIN--SERVER RUNNING ON PORT 4080");
        });
        process.on("beforeExit", function () {
            connection.close();
        });
    });
});
