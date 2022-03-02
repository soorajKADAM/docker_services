const express = require('express')
const MongoClient = require('mongodb').MongoClient

const app = express()

app.use(express.json())    
var database
app.get('/',(req, resp) =>{
    resp.send('welcome to api')
})

 
app.get('/api/products',(req,resp) =>{
    database.collection('products').find({}).toArray((err,result) =>{  
        if(err) throw err
        resp.send(result)
    })
})

 
app.post('/api/products/addproduct',(req,resp) => {
let res = database.collection('products').find({}).sort({id: -1}).limit(1)
res.forEach(obj =>{
    if(obj){
        let productinfo ={
            id: obj.id + 1,
            product: req.body.product,
            price: req.body.price
        }
        database.collection('products').insertOne(productinfo, (err, result) =>{
            if (err) resp.status(500).send(err)
            resp.send("Added succesfully")
        })
    }
})
})
 
app.put('/api/products/:id',(req, resp) => {
    let query = {id: parseInt(req.params.id)}
    let productinfo = {
        id: parseInt(req.params.id),
        product: req.body.product,
        price: req.body.price
    }
    
    database.collection('products').updateOne(
        {id: parseInt(req.params.id)},
        {$set: productinfo}, (err, result) =>{
        if(err) throw err
        resp.send(productinfo)
    })
})

app.delete('/api/products/:id',(req,resp) => {
    database.collection('products').deleteOne(
        {id: parseInt(req.params.id)},
         (err, result) =>{
        if(err) throw err
        resp.send('Record deleted')
    })
})


app.listen(3000, ()=> {  
    MongoClient.connect('mongodb://mongodb:27017/productdb', {useNewUrlParser: true},(error, result)  =>{ //type url for 
         
    if(error) throw error
        database = result.db('productdb')
        console.log('connection successfull')
    })
})