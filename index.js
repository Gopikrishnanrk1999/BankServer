// server creation 

// import express 
const { application } = require('express')
const express = require('express')
// import jsonwebtoken 
const jwt = require('jsonwebtoken')

const dataService= require('./services/data.service')

// server app create using express 

const app = express()

// parse JSON data

app.use(express.json())

// application specific middleware 
const appMiddleware = (req,res,next)=>{
    console.log("Application specific middleware");
    next()
}

// use middleware in app 
app.use(appMiddleware)

// bank server 

const jwtMiddleware = (req,res,next)=>{
    // fetch token
    try{
    token = req.headers['x-access-token']
    // verify token 
    const data = jwt.verify(token,'Secretkey2255')
    console.log(data);
    next()
    }
    catch{
        res.status(401).json({
                status:false,
                statusCode:401,
                message:'Please Log in'
        })
    }
    
}

// register API 
app.post('/register',(req,res)=>{
// register solving 
 const result = dataService.register(req.body.username,req.body.acno,req.body.password)
 res.status(result.statusCode).json(result)
})

// Login API 
app.post('/login',(req,res)=>{
     const result = dataService.login(req.body.acno,req.body.pswd)
     res.status(result.statusCode).json(result)
    })

// Deposit API 
app.post('/deposit',jwtMiddleware,(req,res)=>{
    const result = dataService.deposit(req.body.acno,req.body.password,req.body.amt)
    res.status(result.statusCode).json(result)
   })

//    Withdraw API 
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    const result = dataService.withdraw(req.body.acno,req.body.password,req.body.amt)
    res.status(result.statusCode).json(result)
   })

//    Transaction API 
app.post('/transaction',jwtMiddleware,(req,res)=>{
    const result = dataService.getTransaction(req.body.acno)
    res.status(result.statusCode).json(result)
   })
   
// user request resolving



// get request- to fetch data

app.get('/',(req,res)=>{
    res.send("GET Request")
})

// post request - to create data

app.post('/',(req,res)=>{
    res.send("POST Request")
})

// put request - to modify entire data

app.put('/',(req,res)=>{
    res.send("PUT Request")
})

// patch request - to modify partially

app.patch('/',(req,res)=>{
    res.send("PATCH Request")
})

// delete request - to delete data

app.delete('/',(req,res)=>{
    res.send("DELETE Request")
})

// set up port number to the server app 

app.listen(3000,()=>{
console.log("server started at 3000");
})