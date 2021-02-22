const Product = require('../Models/products');
const ErrorHandler = require('../../Utils/errorHandler');
const asyncErrorHandler = require('../Middleware/asyncErrorMiddleware');

exports.newProduct = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    });
});

exports.getProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        'success': true,
        count: products.length,
        products
    });
});

exports.getSingleProduct = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.Id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    res.status(200).json({
        success: true,
        product
    });
});

exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.Id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    product = await Product.findByIdAndUpdate(req.params.Id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        product
    });
});

exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.Id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    await product.remove();
    res.status(200).json({
        success: true,
        mesaage: 'Product is deleted'
    });
});