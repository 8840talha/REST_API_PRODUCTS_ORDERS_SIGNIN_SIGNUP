var express = require('express');

var multer = require('multer')
const controllers = require('../controllers/products')
const auth = require('../middleware/auth')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})
var productSchema = require('../../models/product');
const router = express.Router();



router.get('/products', controllers.get_all_products);
router.post('/products', upload.single('productImage'), auth, controllers.create_product);
router.delete('/products', auth, controllers.delete_all);
router.get('/products/:prodId', auth, controllers.get_One);
router.delete('/products/:productId', auth, controllers.delete_One)
router.put('/products/:prodId', auth, controllers.edit_One);
router.patch('/products/:prodId', auth, controllers.patch_data)


// router.delete('products/:prodId', auth, (req, res) => {
//     productSchema.delete({ _id: req.params.prodId }).exec()
//         .then(deletedProd => {
//             res.status(200).json({
//                 message: 'Sucessfully deleted item',
//                 deletedDoc: result
//             })
//         }).catch(err => {
//             res.status(500).json({ error: err })
//         })
// })




module.exports = router;