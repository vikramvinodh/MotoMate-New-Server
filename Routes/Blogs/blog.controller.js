const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Article = require('../../Models/Blog/Articals');
const Author = require('../../Models/Blog/Author');
const Category = require('../../Models/Blog/Category');
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require('mongoose');

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
var formattedDate = dd + '-' + mm + '-' + yyyy.toString().substr(-2);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/blogs");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname +
            "-" +
            Date.now() +
            path.extname(file.originalname).toLowerCase()
        );
    },
});
const upload = multer({ storage: storage });

// Handle image uploads
router.post('/upload-image', upload.single('image'), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No image uploaded' });
    }

    const imageUrl = `${process.env.SERVER}/${file.path}`;

    return res.status(200).json({ url: imageUrl });
});

function convertDateFormat(dateString) {

    const parts = dateString.split('-');
    const day = parts[0];
    const month = parts[1];
    const year = '20' + parts[2];


    const mmddyyDate = `${month}/${day}/${year}`;
    return mmddyyDate;
}

router.get('/chart', async (req, res) => {
    try {
        const pages = await Article.find().select('createdAt');
        const uniqueDatesSet = new Set();

        const convertedDates = pages.reduce((result, page) => {
            const convertedDate = convertDateFormat(page.createdAt);
            if (!uniqueDatesSet.has(convertedDate)) {
                uniqueDatesSet.add(convertedDate);
                result.push({ date: convertedDate });
            }
            return result;
        }, []);

        convertedDates.sort((a, b) => (a.date > b.date ? 1 : -1));

        let totalCount = 0;
        const result = convertedDates.map((item) => {
            const date = item.date;
            const count = pages.filter((page) => item.date === convertDateFormat(page.createdAt)).length;
            totalCount += count;

            return {
                date: date,
                totalCount: totalCount,
                count: count,
            };
        });

        res.json(result);
    } catch (error) {
        console.error('Error fetching document count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




// Handle Artical uploads
router.post('/', async (req, res) => {

    try {
        const data = req.body;
        data.createdAt = formattedDate;
        data.updatedAt = formattedDate;
        const result = await Article.create(data);

        if (!result) {
            throw new Error("Couldn't save the Artical")
        } else {
            const authorId = data.author;
            const catagoryId = data.category;
            const aut = await Author.findByIdAndUpdate(
                authorId,
                {
                    $push: { blogs: result._id },
                    $inc: { contribution: 1 }
                },
                { new: true }
            );

            const cat = await Category.findByIdAndUpdate(
                catagoryId,
                { $push: { blogs: result._id } },
                { new: true }
            );
        }
        res.status(200).json({ message: "Created Succesfully", success: true })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }

});

router.get('/recent-posts', async (req, res) => {
    try {
        const recentPosts = await Article.find()
        .sort({ BlogArticleid: -1 }) 
        .limit(10) 
        .select('title slug smalldesc view author')
        res.status(200).json({ success: true, data: recentPosts })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching recent posts', error: error.message })
    }
})


router.get('/count', async (req, res) => {
    try {
        const pages = await Article.countDocuments();
        res.json(pages);
    } catch (error) {
        console.error('Error fetching document count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




router.get('/:slug', async (req, res) => {
    try {
        const data = await Article.findOne({ slug: req.params.slug })
        .select('title body meta_title slug meta_description meta_robots updatedAt faqs bottom_section internal_section smalldesc interested view readTime')
        .populate("author", 'name email');

        if (!data) {
            return res.status(404).json({ success: false, message: "Article not found" });
        }

        return res.status(200).json({ success: true, message: "Retrieved successfully", data });
    } catch (error) {
        console.error("Error fetching article:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});



router.get('/get-one/:id', async (req, res) => {

    try {

        const data = await Article.findById(req.params.id)
            .populate("author")
            .populate("category");

        if (!data) {
            throw new Error("Cannot find data for the id")
        }

        res.status(200).json({ success: true, data })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.patch('/:id', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const prevBlog = await Article.findById(req.params.id).session(session);
        const prevAuthor = await Author.findById(prevBlog.author).session(session);
        const prevCategory = await Category.findById(prevBlog.category).session(session);

        prevAuthor.blogs.pull(req.params.id);
        prevCategory.blogs.pull(req.params.id);

        await prevAuthor.save();
        await prevCategory.save();

        const data = req.body;
        data.updatedAt = formattedDate;

        const update = await Article.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: data },
            { new: true, session }
        );

        const nextAuthor = await Author.findById(update.author).session(session);
        const nextCategory = await Category.findById(update.category).session(session);

        nextAuthor.blogs.push(update._id);
        nextCategory.blogs.push(update._id);

        await nextAuthor.save();
        await nextCategory.save();

        if (!update) {
            throw new Error("Cannot Update Article");
        }

        await session.commitTransaction();

        res.status(200).json({ message: "Update Successfully", success: true });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: error.message });
    } finally {
        session.endSession();
    }
});


router.delete('/:id', async (req, res) => {

    try {

        const id = req.params.id;

        // Find the blog and its category and author
        const blog = await Article.findById(id);
        if (!blog) {
            throw new Error("Blog not found");
        }

        const category = await Category.findOne({ blogs: id });
        if (!category) {
            throw new Error("Category not found");
        }

        const author = await Author.findById(blog.author);
        if (!author) {
            throw new Error("Author not found");
        }

        // Remove the blog from the Article collection
        const result = await Article.findByIdAndDelete(id);
        if (!result) {
            throw new Error("Cannot delete blog");
        }

        // Remove the blog ID from the category and author
        category.blogs.pull(id);
        await category.save();
        author.blogs.pull(id);
        await author.save();

        res.status(200).json({ message: "Deleted successfully", success: true });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router 