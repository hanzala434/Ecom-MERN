const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');

const router = express.Router();

router.post('/:id', createProduct);//category id
router.get('/:id', getProducts);//category id
router.get('/:id/:productId', getProductById);//category Id then productId
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;