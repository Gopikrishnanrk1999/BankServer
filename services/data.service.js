// import jsonwebtoken 
const { status } = require('express/lib/response');
const jwt = require('jsonwebtoken')

// import db.js 
const db= require('./db')

// db = {
//     1000:{"acno":1000,"username":"Neer","password":1000,"balance":4000,transaction: []},
//     1001:{"acno":1001,"username":"Lipin","password":1001,"balance":5000,transaction: []},
//     1002:{"acno":1002,"username":"Girija","password":1002,"balance":2000,transaction: []},
    
//   }

 // register
    const register=(username,acno,password) => {
      // asynchronus 
      return db.User.findOne({
        acno
      }).then(user => {
        console.log(user);
        if (user) {
          return {
            status:false,
            message:"Already registered.. Please Log In",
            statusCode:401

          }
        }
        else{
          const newUser = new db.User({
            acno,
            username,
            password,
            balance: 0,
            transaction:[]
          })
      newUser.save()
      return {
        status:true,
        message:"Registered successfully",
        statusCode:200
      }
    }
  })
  }



  // login 
  const login=(acno,pswd)=> {

    return db.User.findOne({
      acno,
      password: pswd
    }).then(user =>{
      if(user) {
        console.log(user);
        currentUser = user.username
        currentAcno = acno
        // token generation
        token = jwt.sign({
          currentAcno:acno
        },'Secretkey2255')
        return {
          status:true,
          message:"Login successful",
          statusCode:200,
          currentUser,
          currentAcno,
          token
        }
      }
      else{
        return{
          status:false,
          message:"Invalid user or password",
          statusCode:401
        }
      }
    })  
}

// deposit 
const deposit=(req,acno,password,amt) => {
  var amount=parseInt(amt)
  return db.User.findOne({
    acno,password
  }).then(user=>{
    if(user){
      if(acno != req.currentAcno){
        return {
          status:false,
          message:"Permission denied",
          statusCode:401
      } 
      }
      user.balance+=amount
      user.transaction.push({
        type:"CREDIT",
        amount:amount
      })
      user.save()
      return {
        status:true,
        message:amount+ "deposited successfully...New balance is" +user.balance,
        statusCode:200
      }
    }
  else{
    return{
      status:false,
      message:"Invalid Account no or Password",
      statusCode:401
    }
  }
})
}

// withdraw  

const withdraw = (req,acno,password,amt)=> {
  var amount = parseInt(amt)
  return db.User.findOne({
    acno,password
  }).then(user=>{
    if(user){
      if(acno != req.currentAcno){
        return {
          status:false,
          message:"Permission denied",
          statusCode:401
      } 
      }
    if(user.balance>amount){

      user.balance -= amount
      user.transaction.push({
        type:"DEBIT",
        amount:amount
      })
      user.save()
      return {
        status:true,
        message:amount+ "debited successfully...New balance is" +user.balance,
        statusCode:200
      }
    }
    else{
      return {
        status:false,
        message:"Insufficient Balance",
        statusCode:401
    }
  }
  }
  else{
    return {
      status:false,
      message:"Incorrect Password or username",
      statusCode:401
  }
  }

  })
}


// Transaction 
const getTransaction=(acno)=>{
  return db.User.findOne({
    acno
  }).then(user => {
    if(user){
  
      return{
        state:true,
        statusCode:200,
        transaction:user.transaction
      }
    }
      else{
        return{
          status:true,
          message:"User doesn't exist",
          statusCode:401
        }
      }
  })
}

// Delete 

const deleteAcc = (acno)=>{
  return db.User.deleteOne({
    acno
  }).then(user=>{
    if(!user){
      return{
      status: false,
      message: "Operation failed",
      statusCode: 401
    }
  }
    return{
      status:true,
      message:"Successfully deleted",
      statusCode:200
    }

  })
}


//   exportin to use in data service  

  module.exports={
       register,
       login,
       deposit,
       withdraw,
       getTransaction,
       deleteAcc
      }