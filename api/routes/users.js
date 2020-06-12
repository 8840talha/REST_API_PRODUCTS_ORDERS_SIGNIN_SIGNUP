var express = require('express');
const router = express.Router();

const controllers = require('../controllers/user')

router.post('/user/login', controllers.userLogin)
router.get('/user/all', controllers.get_All_Users)
router.post('/user/signup', controllers.userSignup)
router.delete('/user/delete', controllers.delete_All_Users)
router.delete('/user/delete/:id', controllers.delete_User_By_Id)
















module.exports = router;