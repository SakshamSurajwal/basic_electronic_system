const express=require("express");
const { access } = require("../authMiddleware");
const { nominateUser,proposeUser, seconderUser, withdrawl } = require("../controllers/candidateController");

const router=express.Router();

router.route('/nominate').post(access,nominateUser);
router.route('/propose').put(access,proposeUser);
router.route('/seconder').put(access,seconderUser);
router.route('/withdrawl').delete(withdrawl);

module.exports=router;