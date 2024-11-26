const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Category',
    },
    price: {
        type: Number,
        required: true,
    },
    images: [{
        type: String, // URLs or file paths for images
        required: true,
    }],
    colors: [{
        name: {
            type: String, // Color name or code
            required: true,
        },
    }],
    sizes: [{
        name: {
            type: String, // Size name like S, M, L, XL
            required: true,
        },
        instoke: {
            type: Boolean, // Whether the size is in stock
            required: true,
            default: true,
        },
    }],
    description: {
        type: String,
        required: true,
    },
    highlights: {
        type: [String], // Array of highlight points
        required: true,
    },
    details: {
        type: String, // Detailed information about the product
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Products", productSchema);
