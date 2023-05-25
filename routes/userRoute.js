const express=require('express')
const router=express.Router();
const {createUser,getAllUsers,getSingleUser,updateUser,deleteUser,loginUser}=require('../controller/userController');
router.route('/users/all').get(getAllUsers);
router.route('/user/register').post(createUser);
router.route('/user/:id').get(getSingleUser).put(updateUser).delete(deleteUser);
router.route('/user/login').post(loginUser);
module.exports=router;