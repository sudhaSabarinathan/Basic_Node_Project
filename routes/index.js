const express = require('express')
const router = express.Router()

router.get('/', (req,res)=>{
  res.render('index');
})

router.get('/aboutus', (req,res)=>{
  res.render('aboutus', {pagename:'AboutUs'}); 
})

module.exports = router