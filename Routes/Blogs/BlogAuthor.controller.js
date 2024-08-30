const express = require('express');
const router = express.Router();
const Author = require('../../Models/Blog/Author')

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
var formattedDate = dd + '-' + mm + '-' + yyyy.toString().substr(-2);


router.post('/create', async (req, res) => {

    try {
        const data = req.body;
        data.createdAt = formattedDate;
        data.updatedAt = formattedDate;

        const result = await Author.create(data);

        if (!result) {
            throw new Error("Cannot create the category")
        }

        res.status(200).json({ message: "Created Succesfully", success: true })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.get('/', async (req, res) => {

    try {

        const data = await Author.find()
            .populate('blogs');
        res.status(200).json({ message: "Fetch Succesfully", success: true, data })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }

});

router.get('/get-blogs', async (req, res) => {
    const { category_id, limit } = req.query;

    try {
        const author = await Author.findOne({ _id: category_id }).populate('blogs');

        if (!author) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        const final = author.blogs.slice(0, limit);

        const blogs = await Promise.all(final.map(async ele => {
            const author = await Author.findOne({ _id: ele.author });
            return {
                ...ele.toObject(),
                author,
            };
        }));

        return res.status(200).json({ success: true, blogs: blogs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get('/get-one/:id', async (req, res) => {

    try {

        const data = await Author.findById(req.params.id);

        if (!data) {
            throw new Error("Cannot find data for the id")
        }

        res.status(200).json({ message: "Created Succesfully", success: true, data })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.patch('/:id', async (req, res) => {

    try {
        const data = req.body;
        const bottomBlock = JSON.parse(data.bottomBlock)
        const internalBlock = JSON.parse(data.internalBlock)

        data.bottomBlock = bottomBlock;
        data.internalBlock = internalBlock

        data.updatedAt = formattedDate;

        const result = await Author.updateOne(
            { _id: req.params.id },
            { $set: data },
            { new: true } // options
        );

        if (!result) {
            throw new Error("Cannot Update category")
        }

        res.status(200).json({ message: "Updated Succesfully", success: true })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.delete('/:id', async (req, res) => {

    try {
        const id = req.params.id;
        const result = await Author.findByIdAndDelete(id);

        if (!result) {
            throw new Error("Cannot Update category")
        }

        res.status(200).json({ message: "Deleted Succesfully", success: true })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});


router.get('/data', async (req, res) => {

    try {

        const data = await Author.find()
            .populate('blogs', 'view slug title smalldesc')
            .select('contribution name description designation blogs')

        res.status(200).json({ message: "Fetch Succesfully", success: true, data })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }

});

module.exports = router 