const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
    const { name, description, image , imageAlt } = req.body;

    // Validate fields
    if (!name || !image || !imageAlt || !description) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Create new category
    const category = await Category.create({
        name,
        image,
        imageAlt,
        description,
    });

    if (category) {
        res.status(201).json(category);
    } else {
        res.status(400);
        throw new Error('Invalid category data');
    }
});

// Get all categories
const getCategory = asyncHandler(async (req, res) => {
    const category = await Category.find();
    res.status(200).json(category);
});

// Get a single category by ID
const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        res.status(200).json(category);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

// Update a category
const updateCategory = asyncHandler(async (req, res) => {
    const { name, image, imageAlt,description} = req.body;

    const category = await Category.findById(req.params.id);

    if (category) {
        category.name = name || category.name;
        category.description = description || category.description;
        category.image = image || category.image;
        category.imageAlt = imageAlt || category.imageAlt;
        

        const updatedCategory = await category.save();
        res.status(200).json(updatedCategory);
    } else {
        res.status(404);
        throw new Error('category not found');
    }
});

// Delete a category
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        await category.remove();
        res.status(200).json({ message: 'Category removed' });
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

module.exports = {
   createCategory,
   getCategory,
   getCategoryById,
   deleteCategory,
   updateCategory
};
