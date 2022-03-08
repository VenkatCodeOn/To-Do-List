let express=require('express')
let mongodb=require('mongodb')
let sanitizeHTML=require('sanitize-html')

let app=express()
var db=null

app.use(express.static('update'))
app.set('view','views')
app.set('view engine', )

const MongoClient=mongodb.MongoClient;  //Mandatory line //password= Venkat1 username= myApp

let dbString ='mongodb://appuser:Venkat1@cluster0-shard-00-00.ugidp.mongodb.net:27017,cluster0-shard-00-01.ugidp.mongodb.net:27017,cluster0-shard-00-02.ugidp.mongodb.net:27017/myApp?ssl=true&replicaSet=atlas-9ivmkd-shard-0&authSource=admin&retryWrites=true&w=majority'
let dbname='myApp'

let port =process.env.PORT
if(port==null || port==""){
  port=3000
}

MongoClient.connect(dbString,{useNewUrlParser:true,useUnifiedTopology:true},function(err,client){
if(err){
    throw (err)
}
console.log("Connected Successfully")
db=client.db(dbname)
app.listen(port)
//app.listen(PORT)
})

app.use(express.json())
app.use(express.urlencoded({extended:false}))

function password(req,res,next){
  res.set('WWW-Authenticate','Basic realm="App1"')
  if(req.headers.authorization == 'Basic dmVua2F0OjEyMzQ1'){
    next()
  }
  else{
    res.status(401).send("Please Provide your credentials")
  }
}
app.use(password)

app.get('/',function(req,res)
{
  db.collection('items').find().toArray(function(err,items){
    console.log(items) 
  
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-6 text-center py-1 bg-success">To do App Venkat</h1>
        <div class="jumbotron p-3 shadow-sm">
          <form action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        <ul class="list-group pb-5">
        ${items.map(function(item){
          return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">${item.Text}</span>
            <div>
              <button data-id=${item._id} class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
              <button  data-id=${item._id} class="delete-me btn btn-danger btn-sm">Delete</button>
              
              </div>
          </li>`
        } 
        ).join('')}
        </ul>
      </div>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="updated.js"></script>
    </body>
    </html>`)
  })
   
    
})
app.post('/create-item',function(req,res){
  let hackFreeText=sanitizeHTML(req.body.item,{allowedTags:[],allowedAttributes:{}})
db.collection('items').insertOne({Text:hackFreeText},function(err,data){
  if(err){
    throw (err);
  }
  
  
//console.log(req.body.item)
res.redirect('/')
console.log(`${req.body.item} = Data sent Successfully`)
})
})

app.post('/update-item',function(req,res){
  let hackFreeText = sanitizeHTML(req.body.text, {allowedTags:[],allowedAttributes:{}})
  db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)},{$set:{text:hackFreeText}},function(){
    res.send("Data updated")
    //console.log(`${req.body.text} =Updated Data`)
  })
})
app.post('/delete-item',function(req,res){
  db.collection('items').deleteOne({_id:new mongodb.ObjectId(req.body.id)},function(){
    res.send("Data Deleted")
    //console.log(`${req.body.text} =Deleted Data`)
  })
})



//
