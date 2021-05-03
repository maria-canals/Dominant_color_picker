const express = require('express');
const mongoose = require('mongoose');

const uri = 'mongodb+srv://root:root@cluster0.y4pfl.mongodb.net/colorPicker';

const app = express();
app.set('view engine', 'ejs');

const imagesRouters = require('./routes/images');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.static('uploads'));

app.use(imagesRouters);

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
	app.listen(3000);
});
