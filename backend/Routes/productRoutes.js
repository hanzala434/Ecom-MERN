const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getPopularProducts } = require('../controllers/productController');

const router = express.Router();

router.post('/:id', createProduct);//category id
router.get('/popular', getPopularProducts);
router.get('/:id', getProducts);//category id
router.get('/get/:id', getProductById);//productId
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
