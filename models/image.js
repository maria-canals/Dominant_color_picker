const mongoose = require('mongoose');

const { Schema } = mongoose;

const imageSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	date: {
		type: String,
	},
	url: {
		type: String,
	},
	dominantColor: {
		type: Array,
	},
	text: {
		type: String,
	},
	img: { contentType: String, path: String, image: Buffer },
	imageFile: String,
});

const Image = mongoose.model('image', imageSchema);

module.exports = Image;
