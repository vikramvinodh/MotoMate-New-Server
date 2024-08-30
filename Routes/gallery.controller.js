const express = require('express');
const MainGallery = require('../Models/MainGallery')
const multer = require('multer');
const configureS3 = require('../Middleware/S3_Bucket');
const fetchuser = require('../Middleware/fetchuser');
const router = express.Router();

/* ----------------------------------------------------------------------------------------------------------------

                                             S3 Upload Funtion and Multer Config

------------------------------------------------------------------------------------------------------------------- */


// Multer configuration for handling files
const upload = multer();

// Function to upload images to S3 bucket
// Function to upload a file to S3 bucket
const uploadToS3 = async (file) => {
    const key = `gallery/${Date.now().toString()}-${Math.random().toString(36).substring(2, 15)}-${file.originalname}`;

    const params = {
        Bucket: 'zenit-space-1',
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    };

    const result = await configureS3().upload(params).promise();
    return result.Location;
};

// Function to delete a file from S3 bucket
const deleteFromS3 = async (fileUrl) => {
    const key = fileUrl.split('/').slice(-1)[0];

    const params = {
        Bucket: 'zenit-space-1',
        Key: `gallery/${key}`
    };

    await configureS3().deleteObject(params).promise();
};

// Upload an image
router.post("/main-gallery/upload", upload.single("image"), async (req, res) => {
    try {
        const s3Url = await uploadToS3(req.file);

        const newImage = new MainGallery({
            imagesLink: s3Url,
        });

        await newImage.save();

        res.status(200).json({ message: "Image uploaded successfully.", imageUrl: s3Url });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: "Error uploading image." });
    }
});

// Delete an image
router.delete('/main-gallery/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the image document in the MainGallery collection
        const image = await MainGallery.findById(id);
        if (!image) {
            return res.status(404).json({ error: 'Image not found.' });
        }

        // Delete the image from S3
        await deleteFromS3(image.imagesLink);

        // Remove the image document from the MainGallery collection
        await MainGallery.findByIdAndDelete(id);

        res.status(200).json({ message: 'Image deleted successfully.' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Error deleting image.' });
    }
});

router.get('/main-gallery/all', async (req, res) => {
    try {
        // Query the MainGallery collection to get all images
        const images = await MainGallery.find();

        // Respond with the list of images
        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Error fetching images.' });
    }
});





module.exports = router 