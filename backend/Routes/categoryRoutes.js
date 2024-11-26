const express = require('express');
const { createCategory,getCategory,getCategoryById,deleteCategory,updateCategory } = require('../controllers/categoryController');

const router = express.Router();

router.post('/', createCategory);
router.get('/', getCategory);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
