const Product = require('../models/Products');
const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
    const { name, price, images, colors, sizes, description, highlights, details } = req.body;

    // Validate fields
    if (!name || !price || !images || !colors || !sizes || !description || !highlights || !details) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(400);
        throw new Error('category not found');
    }

    // Create new product
    const product = await Product.create({
        name,
        price,
        images,
        colors,
        sizes,
        description,
        highlights,
        details,
        category: req.params.id,
        categoryName: category.name
    });

    if (product) {
        res.status(201).json(product);
    } else {
        res.status(400);
        throw new Error('Invalid product data');
    }
});

// Get all products
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ category: req.params.id  });
    res.status(200).json(products);
});

// Get a single product by ID
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findOne({_id: req.params.productId, 
                                          category: req.params.id})

    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// Update a product
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, images, colors, sizes, description, highlights, details } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.images = images || product.images;
        product.colors = colors || product.colors;
        product.sizes = sizes || product.sizes;
        product.description = description || product.description;
        product.highlights = highlights || product.highlights;
        product.details = details || product.details;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.remove();
        res.status(200).json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
