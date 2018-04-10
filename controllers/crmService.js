var Accounts = require('../model/accountModel.js');

class accountService{

//accountList
  static accountList(){
    return Accounts.find({})
      .then((accounts)=>{
        return accounts;
      });
  }

//Find one account. note: I do not think the application uses this method right now
  static accountListOne(id){
    return Accounts.findById(id)
      .then((account)=>{
        return account;
      });
  }

//create
  static createAccount(obj){
    /*
    Here is what the object needs to look like:
    var acc = {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      owner: req.body.owner
    }
    */
    var account = new Accounts(obj);
    return account.save();
  }


//update
  static updateAccount(id,obj){
    console.log('Here+obj'+obj);
    return Accounts.findById(id)
      .then((acc)=>{
        acc.set(obj);
        return acc.save();
        //console.log(account);
        //return account;
      }).catch((err)=>{
        console.log('err'+err);
      });

  }

  //delete
  static deleteAccount(id){
    return Accounts.remove({_id:id})
      .then((obj)=>{
        return obj;
      });

  }


}

module.exports.accountService = accountService;
