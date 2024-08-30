const express = require('express');
const path = require('path');
const connectToMongo = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectToRedis } = require('./config/redis');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Connect to MongoDB
connectToMongo();

// Connect to Redis
connectToRedis()

// Middleware
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('common'));

// Enable CORS for all routes
app.use(cors());

// Static file serving
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Admin panel routers
app.use('/auth', require('./Routes/auth.controller'));
app.use('/gallery', require('./Routes/gallery.controller'));
app.use('/blogs', require('./Routes/Blogs/blog.controller'));
app.use('/blog-category', require('./Routes/Blogs/BlogCategory.controller'));
app.use('/blog-author', require('./Routes/Blogs/BlogAuthor.controller'));
app.use('/logs', require('./Routes/logs.controller'));
app.use('/products', require('./Routes/product.controller'))

// Start the server
app.listen(process.env.PORT, () => 
    console.log(`Server is running on ${process.env.PORT}`)
);
