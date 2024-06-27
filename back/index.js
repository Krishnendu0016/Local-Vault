const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/localvault', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Password Schema
const passwordSchema = new mongoose.Schema({
    websiteName: String,
    websiteLink: String,
    username: String,
    password: String
});

const Password = mongoose.model('Password', passwordSchema);

// Routes
app.post('/passwords', async (req, res) => {
    const newPassword = new Password(req.body);
    await newPassword.save();
    res.send(newPassword);
});

app.get('/passwords', async (req, res) => {
    const passwords = await Password.find();
    res.send(passwords);
});

app.put('/passwords/:id', async (req, res) => {
    const updatedPassword = await Password.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updatedPassword);
});

app.delete('/passwords/:id', async (req, res) => {
    await Password.findByIdAndDelete(req.params.id);
    res.send({ message: 'Password deleted' });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
