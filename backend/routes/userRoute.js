const express=require("express");
const { access } = require("../authMiddleware");
const {registerUser,authUser, vote,getCandidates}=require('../controllers/userController');

const router=express.Router();

router.route('/').post(registerUser);
router.post('/login',authUser);
router.route('/vote').put(access,vote);
router.route('/getCandidates').get(access,getCandidates);

module.exports=router;