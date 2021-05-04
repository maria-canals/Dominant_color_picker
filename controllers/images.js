const Image = require('../models/image');
const { contrastColor } = require('contrast-color');
const { getColorFromURL } = require('color-thief-node');
const { getColor } = require('color-thief-node');
const { rgbToHex } = require('../utils/app.js');
const Canvas = require('canvas');

exports.showMainPage = async (req, res) => {
	const allImages = await Image.find();
	res.render('pages/index', {
		images: allImages,
		path: '/pages/index',
	});
};

exports.showFormPage = async (req, res) => {
	res.render('pages/add-image', {
		error: false,
		path: '/pages/add-image',
	});
};

exports.postFormParge = async (req, res) => {
	var image = '';
	const imageURL = req.body.imageURL;

	if (req.file == undefined && imageURL == "") {
		return res.render('pages/add-image', {
			error: 'Please upload an image or an URL',
			path: '/pages/add-image',
			images: null,
		});
		
	} else if (req.file != undefined && imageURL != "") {
		return res.render('pages/add-image', {
			error: 'Please upload an image OR an URL not both',
			path: '/pages/add-image',
			images: null,
		});
	} else if (imageURL != "") {
		const doesUrlExist = await Image.find({ url: imageURL });
			if (doesUrlExist.length > 0) {
		 	return res.render('pages/add-image', {
		 		error: `This URL already exists.`,
		 		path: '/pages/add-image',
		 		images: null,
		 	})	
		 }
		 const dominantColor = await getColorFromURL(imageURL);

		 let r, g, b;
		 [r, g, b] = [dominantColor[0], dominantColor[1], dominantColor[2]];
		 const color = rgbToHex(r, g, b);
		 const textColor = contrastColor({ bgColor: color });
	 
		 const newImage = new Image({
			 title: req.body.title,
			 date: req.body.date,
			 url: imageURL,
			 dominantColor,
			 text: textColor,
			 imageFile: imageURL,
		 });
	 
		 await newImage.save();
		 res.redirect('/');
		 
	} else {
		image = req.file.filename;
		const doesImageExist = await Image.find({
			imageFile: image,
		});
		if (doesImageExist.length > 0) {
			return res.render('pages/add-image', {
				error: 'This image already exists.',
				path: '/pages/add-image',
				images: null,
			});
		}

		let img = await Canvas.loadImage("./uploads/"  + image)
		img.width = 200;
		img.height = 200;

		const dominantColor = await getColor(img);
		let r, g, b;
		[r, g, b] = [dominantColor[0], dominantColor[1], dominantColor[2]];
		const color = rgbToHex(r, g, b);
		const textColor = contrastColor({ bgColor: color });
		

		const newImage = new Image({
			title: req.body.title,
			date: req.body.date,
			url: imageURL,
			dominantColor,
			text: textColor,
			imageFile: image,
		});
	
		await newImage.save();
		res.redirect('/');
  
	
	}

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
		path: 'pages/edit-image',
	});
};

exports.saveEditedImage = async (req, res) => {
	const title = req.body.title;
	const date = req.body.date;
	const id = req.params.id;

	await Image.updateOne({ _id: id }, { $set: { title: title, date: date } });
	res.redirect('/');
};
