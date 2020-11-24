const {Router} = require('express');
const router = Router();
const redirect = require('../middleware/redirect');

router.get('/',redirect,(req,res)=>{
    res.render('home',{
        isHome:true,
        title:'Home'
    })
})


module.exports = router;