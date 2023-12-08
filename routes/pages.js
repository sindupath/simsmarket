const express = require('express');
 const router = express.Router();
 const userController = require('../controllers/users')


router.get("/",(req,res)=>{
    res.render("index")
});
router.get("/register",(req,res)=>{
    res.render("register")
});
router.get("/login",(req,res)=>{
    res.render("login")
});
router.get("/profile",userController.isLoggedIn,(req,res)=>{
   
if(req.user){
    res.render("profile",{user:req.user});

}else{
res.redirect('login')
}
   
});
router.get("/forget",(req,res)=>{
    res.render("forget-pass")
});
router.get("/forget-otp",(req,res)=>{
    res.render("forget-pass-otp")
});
router.get("/register-otp",(req,res)=>{
    res.render("sign-up-otp")
});

module.exports = router;