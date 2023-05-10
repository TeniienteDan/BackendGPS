'use strict'
const express = require('express');
const productController = require('../controller/product.controller.js');
const router = express.Router();
const middleware =require('../middleware/auth.js');

router.get('/product',productController.getProduct);
router.post('/product',productController.insertProduct);
router.put('/product/:_id',productController.updateProduct);
router.delete('/product/:_id',productController.deleteProduct);
router.get('/product/search/:_id',productController.searchProductById);
router.get('/product/:code',productController.searchProductByCode);
module.exports=router;