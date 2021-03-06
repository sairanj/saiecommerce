const Product = require('../Models/products');
const ErrorHandler = require('../../Utils/errorHandler');
const asyncErrorHandler = require('../Middleware/asyncErrorMiddleware');
const APIFeatures = require('../../Utils/APIFeatures');


exports.newProduct = asyncErrorHandler(async (req, res, next) => {
    //TODO Ranjith Adding the User id for the products
    //TODO Ranjith good thing is figure it out how monogdb finds only the product object and save to database
    //TODO Ranjith This request may have multiple objects like users:{...}, products:{....}
    req.body.user = req.user.id;
    console.log(req.body)
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    });
});

exports.getProducts = asyncErrorHandler(async (req, res, next) => {
    //return next(new ErrorHandler('Product not found', 400));

    let resultsPerPage = 20;
    const totalProductCount = await Product.countDocuments();
    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter();
    //.pagination(resultsPerPage);

    //TODO  Ranj - Find how this (. query) is working...need to investigate more - Javascript Magic
    let products = await apiFeatures.query;

    let filteredProductsCount = products.length;
    if (resultsPerPage > 0) {
        apiFeatures.pagination(resultsPerPage);
    }
    products = await apiFeatures.query;

    //setTimeout(() => {
    res.status(200).json({
        'success': true,
        totalProductCount,
        resultsPerPage,
        filteredProductsCount,
        products
    });
    // }, 5000);
});

exports.getSingleProduct = asyncErrorHandler(async (req, res, next) => {
    //return next(new ErrorHandler('Product not found', 400));
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