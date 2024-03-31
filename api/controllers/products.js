const Product = require("../models/product");
const mongoose = require("mongoose");

exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .then(result => {
            const response = {
                count: result.length,
                products: result.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'https://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            // if (result.length >= 0) {
            res.status(200).json({
                message: 'Products retrieved successfully',
                description: 'Get all products',
                products: response
            });
            // } else {
            //     res.status(404).json({
            //         message: 'No entries found'
            //         });
            // }

        })
        .catch(err => {

            res.status(500).json({
                error: err
            })
        });
}

exports.products_create = (req, res, next) => {

    const product = new Product(
        {
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            productImage: req.file.path
        }
    );
    //Mongoose save
    product.save()
        .then(result => {

            res.status(201).json({
                message: 'Product has created',
                description: 'Create a single product with name and price',
                product: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'https://localhost:3000/products/' + result._id
                    }
                }
            });

        }).catch(err => {

        res.status(500).json({
            error: err
        })
    })
}

exports.products_get_by_id = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .then(result => {

                if (result) {
                    res.status(200).json({
                        message: 'Product retrieved',
                        description: 'Get a single product by id',
                        product: result,
                        request: {
                            type: 'GET',
                            url: 'https://localhost:3000/products/' + result._id
                        }
                    });
                } else {
                    res.status(404).json({
                        message: "No valid entry found for that id"
                    });
                }
            }
        )
        .catch(err => {
            res.status(500).json({error: err});
        });
}

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const newProduct = req.body; //without validations

    const updateOptions = {};
    for (const opt of newProduct) {
        updateOptions[opt.propName] = opt.value;
    }

    Product.findByIdAndUpdate(id, updateOptions, {new: true})
        .select('name price _id')
        .then(result => {
                if (!result) {
                    return res.status(404).json({
                        message: 'Product not found'
                    });
                }

                res.status(200).json({
                    message: 'Product updated successfully',
                    description: 'Update product in each field',
                    updatedProduct: {
                        product: result,
                        request: {
                            type: 'GET',
                            url: 'https://localhost:3000/products/' + result._id
                        }
                    }
                });
            }
        )
        .catch(err => {

            res.status(500).json({
                error: err
            })
        });
}

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndDelete(id)
        .select('name price _id')
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            res.status(200).json({
                message: 'Product deleted successfully',
                description: 'Delete product by id',
                data: result,
                request: {
                    type: 'POST',
                    url: 'https://localhost:3000/products/',
                    body: {name: "String", price: "Number"}
                }

            });
        }).catch(err => {
        console.error('Deletion of product fail', err);
        res.status(500).json({
            error: err
        });
    });
}