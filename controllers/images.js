const Image = require('../models/image');
const { contrastColor } = require('contrast-color');
const { getColorFromURL } = require('color-thief-node');
const { rgbToHex } = require('../utils/app.js');
const fs = require('fs');

exports.showMainPage = async (req, res) => {
	const allImages = await Image.find();
	res.render('pages/index', {
		images: allImages,
	});
};

exports.showFormPage = async (req, res) => {
	res.render('pages/add-image');
};

exports.postFormParge = async (req, res) => {
	const file = req.file;
	console.log(file);
	const img = fs.readFileSync(req.file.path);
	// const encode_image = img.toString('base64');

	const imageFile = req.file.filename;
	console.log(req.file);

	const imageURL = req.body.imageURL;

	// const doesUrlExist = await Image.find({ url: imageURL });
	// if (doesUrlExist.length > 0) {
	// 	res.render('pages/add-image', { exists: 'caca' });
	// 	return;
	// }

	const title = req.body.title;
	const date = req.body.date;
	const dominantColor = await getColorFromURL(imageURL);
	let r, g, b;
	[r, g, b] = [dominantColor[0], dominantColor[1], dominantColor[2]];
	const color = rgbToHex(r, g, b);
	const textColor = contrastColor({ bgColor: color });

	const newImage = new Image({
		title,
		date,
		url: imageURL,
		dominantColor,
		text: textColor,
		imageFile: imageFile,
	});

	await newImage.save();
	res.redirect('/');
};

exports.deleteImage = async (req, res) => {
	Image.deleteOne({ _id: req.params.id }, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('deleted on db');
		}
		res.redirect('/');
	});
};

exports.editImage = async (req, res) => {
	const foundImage = await Image.find({ _id: req.params.id });
	res.render('pages/edit-image', {
		image: foundImage[0],
	});
};

exports.saveEditedImage = async (req, res) => {
	const title = req.body.title;
	const date = req.body.date;
	const id = req.params.id;

	await Image.updateOne({ _id: id }, { $set: { title: title, date: date } });
	res.redirect('/');
};
