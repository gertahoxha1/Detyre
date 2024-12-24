const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS
app.use(cors());

// Connect to MongoDB (no need for deprecated options anymore)
mongoose.connect('mongodb://localhost:27017/crud-db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

// Define a simple schema and model for MongoDB
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Define a route to create a new user
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));