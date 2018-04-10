var express = require('express');
var router = express.Router();
var accModel = require('../model/accountModel.js');
var nodemailer = require('nodemailer');
var crmController = require('../controllers/crmService.js');


const crmService = crmController.accountService;

/* GET home page. */
router.get('/', function(req, res, next) {
  //Open the account entry pug template
  res.render('index', { title: 'Express CRM'});//,accountList: accounts});

});

//When user clicks View All Account, we will pass them to a page where they can view a table view of Accounts.
router.get('/getAccounts',function(req, res, next){
  //find all accounts and show them in a table using accountList template
  crmService.accountList()
    .then((accounts)=>{
      res.render('accountList', { title: 'Express CRM',accountList: accounts});
    })
    .catch((error)=>{
      res.end("ERROR!");
    });

});

router.get('/updateAccount/:accId',function(req,res,next){
  //Pass an account id to Mongo db and then render updateAccount pug template
  crmService.accountListOne(req.params.accId)
    .then((accounts)=>{
      res.render('updateAccount', { title: 'Express CRM',accountList: accounts});
    })
    .catch((error)=>{
      res.end("ERROR!");
    });
});

router.get('/deleteAccount/:accId',function(req,res,next){
  //Pass an account id to Mongo db and remove the record, then render getAccounts page

  crmService.deleteAccount(req.params.accId)
    .then((deletedAccount)=>{
        res.redirect('/getAccounts');
      })
    .catch((error)=>{
      res.end("ERROR!"+error);
    });
});

router.post('/accounts/:accId',(req,res,next)=>{
  //from the update account page, we pass an account id and overwrite some of the fields
  var obj = {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    owner: req.body.owner
  }
  console.log(req.params.accId);
  var id = req.params.accId;
  crmService.updateAccount(id,obj)
    .then((updatedAccount)=>{
      console.log('here i am');
      res.redirect('/getAccounts');
    }).catch((err)=>{
      res.end("Error!");
    });

});

router.post('/accounts', (req, res, next)=>{
  //From the home page, we post new accounts to the db
  var acc = {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    owner: req.body.owner
  }
  //var theAccounts =  new accModel(acc);
  crmService.createAccount(acc)
    .then((updatedAccount)=>{
      res.redirect('/');
    })
    .catch((err)=>{
      if(err){
        console.log(err.stack)
      }
    })
});

router.get('/sendEmail/:email',(req,res,next)=>{
  //Open the email sending interface
  res.render('email', { emailAddress: req.params.email});
});

router.post('/sendEmail/:email',(req, res, next)=>{
  //Use the nodemailer package  to send an email from expresscrm123@gmail.com
  //This is an gmail account that I created for this. The username and password are stored in environment variables
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  //Create the email
  var mailOptions = {
    from: 'expresscrm123@gmail.com',
    to: req.params.email,
    subject: req.body.subject,
    text: req.body.emailContent
  };
  //send the email
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.redirect('/getAccounts');
    }
  });
});

module.exports = router;
