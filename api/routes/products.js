const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const date = new Date().toISOString().replace(/[:\.]/g, '-');
        cb(null, date + file.originalname.replace(/ /g, '_'));
    }
});

//Filters for files
const fileFilter = (req, file, cb) => {
    //Reject
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' ){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//Endpoits
router.get('/', checkAuth, ProductsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create);

router.get('/:productId', checkAuth, ProductsController.products_create);

router.patch('/:productId', checkAuth, ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;
