const express = require('express');
const router = express.Router();
const Product = require('../Models/Products');

// Create a new product
router.post('/', async (req, res) => {
    try {
        const { image, name, description, price } = req.body;
        const newProduct = new Product({ image, name, description, price });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Read all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Read a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Update a product by ID
router.put('/:id', async (req, res) => {
    try {
        const { image, name, description, price } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            image, name, description, price
        }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(201).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

module.exports = router;
