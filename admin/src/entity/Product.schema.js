"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
var mongoose_1 = require("mongoose");
var productSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
});
exports.Product = mongoose_1.default.model("Product", productSchema);
