const { Router } = require("express");
const router = Router();
const nodemailer = require('nodemailer');
const User = require('../models/user');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ramilramil180396@gmail.com',
      pass: 'gurugrum'
    }
  });


router.get("/profile", (req, res) => {
  res.render("profile", {
    title: "Profile",
    isProfile: true,
    user:req.user.toObject()
  });
});

router.post('/avatar',async(req,res)=>{
  try {
    const user = await User.findById(req.user._id)
    if (req.file) {
      user.avatarUrl = req.file.path
    }
    await user.save()
    res.redirect('/profile')
  } catch (error) {
    console.log(error)
  }
})

router.post('/mail',(req,res)=>{
    try {
        transporter.sendMail({
            from: 'ramilramil180396@gmail.com',
            to: 'ramilramil180396@gmail.com',
            subject: 'Sending Email using Node.js',
            text: req.body.message
          }, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          res.redirect('/profile')
    } catch (error) {
        console.log(err)
    }
   
    
})

module.exports = router;
