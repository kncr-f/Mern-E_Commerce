import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";


// @desc Fetch all products
// @route GET /api/products 
// @access Public

const getProducts = asyncHandler(async (req, res) => {

    const searchTerm = req.query.search ? {
        name: {
            $regex: req.query.search,
            $options: "i"
        }
    } : {};

    const products = await Product.find({ ...searchTerm });
    res.json(products);

});




// @desc Fetch single products
// @route GET /api/products/:id
// @access Public


const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {

        res.json(product);

    } else {
        res.status(404);
        throw new Error("Product not found");
    }

});


// @desc Delete a product
// @route DELETE /api/products/:id
// @access Public/Admin


const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        product.delete();
        res.json({ message: "product successfully deleted" })


    } else {
        res.status(404);
        throw new Error("Product not found");
    }

});


// @desc Create a product
// @route POST /api/products
// @access Public/Admin


const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: "sample name",
        price: 0,
        user: req.user._id,
        image: "/images/sample.jpg",
        brand: "Sample brand",
        category: "Sample category",
        countInStock: 0,
        numReviews: 0,
        description: "Sample description"
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct)

});



// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin


const updateProduct = asyncHandler(async (req, res) => {

    const { name, price, image, category, countInStock, description, brand } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.image = image;
        product.category = category;
        product.countInStock = countInStock;
        product.description = description;
        product.brand = brand;

        const updatedProduct = await product.save();
        res.json(updatedProduct);

    } else {
        res.status(404);
        throw new Error
    }


});



// @desc create a new review
// @route POST /api/products/:id/reviews
// @access Private

const createProductReview = asyncHandler(async (req, res) => {

    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            item => item.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error("Product already reviewed")
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        }

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: "Review added" });

    } else {
        res.status(404);
        throw new Error("Product not found");
    }


});

export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview

}