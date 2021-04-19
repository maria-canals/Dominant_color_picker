const BBDD = [{urlimagen: "https://i.picsum.photos/id/237/536/354.jpg?hmac=i0yVXW1ORpyCZpQ-CknuyV-jbtU7_x9EBQVhvT5aRr0", date: "2021-04-19" , titulo: "Black dog"}]

const express = require('express');
const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}))


app.use(express.static('public'));


app.get('/', (req, res) => {
	res.render('pages/index' , {images: BBDD});
});

app.get('/add-image', (req, res) => {
	
	res.render('pages/add-image')
})

app.post('/add-image', (req, res) => {
	console.log(urlExist(req.body.urlimagen))
	res.send('Envio!')
})

app.listen(3000);

function urlExist(url) {
	var compare = (element) => element.urlimagen == url
	return	BBDD.some(compare)
}