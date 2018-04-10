var express = require('express');
var router = express.Router();
var multer = require('multer');
var crmController = require('../../controllers/crmService.js');

const crmService = crmController.accountService;

router.use((req, res, next)=>{
  res.set({
    // Allow AJAX access from any domain
    'Access-Control-Allow-Origin':'*',
    // Allow methods and headers for 'preflight'
    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers',
  });
  // if this is a preflight, we're done and can send the response with our headers
  if(req.method == 'OPTIONS'){
    return res.status(200).end();
  }
  next();
})


//get all accounts
router.get('/',(req,res,next)=>{
  crmService.accountList()
    .then((accounts)=>{
      console.log(`API: Found accounts: ${accounts}`);
      res.status(200);
      res.set({'Content-type':'application/json'});
      res.send(JSON.stringify(accounts));
    })
});

//get one account
router.get('/getAccount/:accId',(req,res,next)=>{
  crmService.accountListOne(req.params.accId)
    .then((account)=>{
      console.log(`API: Found account: ${account}`);
      res.status(200);
      res.set({'Content-type':'application/json'});
      res.send(JSON.stringify(account));
    })
});

//update one account
router.put('/updateAccount/:accId',(req,res,next)=>{
  var obj = {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    owner: req.body.owner
  }
  crmService.updateAccount(req.params.accId,obj)
    .then((updatedAccount)=>{
      console.log(`API: Found account: ${updatedAccount}`);
      res.status(200);
      res.send(JSON.stringify(updatedAccount));
    }).catch((err)=>{
      res.status(404);
      res.end();
    });
});

//create one account
router.post('/createAccount',(req,res,next)=>{
  var obj = {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    owner: req.body.owner
  }
  crmService.createAccount(obj)
    .then((updatedAccount)=>{
      console.log(`API: Found account: ${updatedAccount}`);
      res.status(200);
      res.send(JSON.stringify(updatedAccount));
    }).catch((err)=>{
      res.status(404);
      res.end();
    });
});

//update one account
router.delete('/deleteAccount/:accId',(req,res,next)=>{

  crmService.deleteAccount(req.params.accId)
    .then((deletedAccount)=>{
      console.log(`API: Found account: ${deletedAccount}`);
      res.status(200);
      res.send(JSON.stringify(deletedAccount));
    }).catch((err)=>{
      res.status(404);
      res.end();
    });
});

// export our router

module.exports = router;
