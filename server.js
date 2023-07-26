const express = require('express');
const mongoose = require('mongoose')
const Blogs = require('./models/user');
const path = require('path')
const bodyParser = require('body-parser');
const multer = require('multer');
const { log } = require('console');
const app = express();
const port = 3000;
// ! Upload handler for Upload file to the Server
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "public/uploads")
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + "-" + Date.now() + ".jpg")
        }
    })
}).single("image")


// Middleware to parse JSON request body
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
require('dotenv').config()
app.use(express.static(path.join(__dirname, "public")))
// Login endpoint
app.post('/login', (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    if (username === "user" && password === "user") {
        res.send('Login! Successful')

    } else {
        res.send("Login! Failed")
    }
})
app.post('/admin', (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    if (username === "admin" && password === "admin") {
        res.send('Login! Successful')

    } else {
        res.send("Login! Failed")
    }
})
//  save blogs
app.post('/blogs', upload, (req, res) => {
    // console.log(req.body.value);
    // console.log(req);
    console.log(req.body);

    const { title, description, category } = req.body
    const image = req.file ? req.file.filename : '';
    if (title && description && image && category !== "Select Category") {
        const newBlog = new Blogs({
            title: title,
            description: description,
            image: image,
            category: category
        });

        newBlog.save()
            .then(() => {
                console.log('User created:');
            })
            .catch((error) => {
                console.error('Error creating user:', error);
            });
        res.send("Blog Created Successfully")
    } else {
        res.send("Incorrect Information ")
    }
})

// Fetch a specific blog by ID
app.get('/api/blogs/:id', (req, res) => {
    const blogId = req.params.id;
    // const category = req.query
    Blogs.findById(blogId)
        .then((blog) => {
            if (blog) {
                // Blog found, send it as the response
                res.json(blog);
            } else {
                // Blog not found
                res.status(404).json({ error: 'Blog not found' });
            }
        })
        .catch((error) => {
            // Error occurred during database query
            res.status(500).json({ error: 'Interal Dikkat' });
        });
});


// Fetch API to show ALL blogs
app.get('/api/blogs', async (req, res) => {
    data = await Blogs.find()
    res.json(data)
})

// API to perform Update on the MongoDb using The blogId
app.put('/api/blogs/:id', async (req, res) => {
    const blogId = req.params.id;
    const newStatus = req.body.status;
    // console.log(blogId, newStatus);
    try {
        // Find the blog by ID in the database
        const blog = await Blogs.findById(blogId);

        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        // Update the blog status
        blog.status = newStatus;
        await blog.save();

        return res.status(200).send('Blog status updated successfully');
    } catch (err) {
        // console.error('Error updating blog status:', error);
        return res.status(500).send('Internal servo error');
        // }
    }
});

// API to perform Delete on the MongoDb using The blogId
app.delete('/api/blogs/:id', async (req, res) => {
    const blogId = req.params.id;
  console.log(blogId);
    try {
      // Find the blog by ID in the database
      const blog = await Blogs.findByIdAndDelete(blogId)
      console.log("BLog Deleted With ID:",blog);
      return res.status(200).send('Blog permanently deleted');
    } catch (err) {
      console.error('Error deleting blog:', err);
      return res.status(500).send("Internal Pareshani");
    }
  });


// mongoose connect
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})