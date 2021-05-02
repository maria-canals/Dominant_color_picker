const express = require('express');

const imagesController = require('../controllers/images');

const router = express.Router();
const app = express();

router.get('/', imagesController.showMainPage);

router.get('/add-image', imagesController.showFormPage);
router.post('/add-image', imagesController.postFormParge);

router.get('/images/delete/:id', imagesController.deleteImage);

router.get('/images/edit/:id', imagesController.editImage);
router.post('/images/edit/:id', imagesController.saveEditedImage);

router.use((req, res) => {
	res
		.status(404)
		.render('includes/404', { error: '404 ERROR. The resource was not found' });
});

module.exports = router;
