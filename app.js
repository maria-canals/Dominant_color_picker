const { nanoid } = require('nanoid');

let BBDD = [
	{
		urlimagen:
			'https://i.picsum.photos/id/237/536/354.jpg?hmac=i0yVXW1ORpyCZpQ-CknuyV-jbtU7_x9EBQVhvT5aRr0',
		date: '2020-04-18',
		titulo: 'Black dog',
		color: [42, 35, 32],
		id: nanoid(),
	},
	{
		urlimagen:
			'https://i.picsum.photos/id/490/200/300.jpg?hmac=8hYDsOwzzMCthBMYMN9bM6POtrJfVAmsvamM2oOEiF4',
		date: '2021-04-19',
		titulo: 'Bol',
		color: [43, 34, 28],
		id: nanoid(),
	},
];

BBDD = BBDD.sort((a, b) => new Date(b.date) - new Date(a.date));

const { getColorFromURL } = require('color-thief-node');

const express = require('express');
const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('pages/index', { images: BBDD });
});

app.get('/add-image', (req, res) => {
	res.render('pages/add-image');
});

app.get('/images/delete/:id', (req, res) => {
	deleteImage(req.params.id);
	res.redirect('/');
});

app.get('/images/edit/:id', (req, res) => {
	let image = BBDD.find(element => element.id == req.params.id);
	res.render('pages/edit-image', { image: image });
});

app.post('/images/edit/:id', (req, res) => {
	let index = BBDD.findIndex(element => element.id == req.params.id);
	BBDD[index].date = req.body.date;
	BBDD[index].titulo = req.body.titulo;
	res.redirect('/');
});
app.post('/add-image', (req, res) => {
	if (urlExist(req.body.urlimagen)) {
		res.send('This URL already exists');
		return;
	}
	const image = {
		urlimagen: req.body.urlimagen,
		date: req.body.date,
		titulo: req.body.titulo,
		id: nanoid(),
	};

	(async () => {
		const dominantColor = await getColorFromURL(image.urlimagen);
		image.color = dominantColor;
		BBDD.push(image);
		BBDD = BBDD.sort((a, b) => new Date(b.date) - new Date(a.date));
		res.redirect('/');
	})();
});

app.listen(3000);

const urlExist = url => {
	const compare = element => element.urlimagen == url;
	return BBDD.some(compare);
};

const deleteImage = imageId => {
	const deleteIndex = BBDD.findIndex(element => element.id == imageId);
	BBDD.splice(deleteIndex, 1);
};
