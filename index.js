const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());





const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rcwtj7y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.rcwtj7y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

     const roomMateCollection = client.db('roommateDb').collection('roomMate');




    

    app.get('/', async(req,res)=>{
        const result = await roomMateCollection.find().toArray();
        res.send(result);
    })

    // app.get('/mylisting/:id', async(req,res)=>{
    //   const id = req.params.body;
    //   const query = {_id: new ObjectId(id)};
    //   const result = await roomMateCollection.find(query).toArray();
    //   console.log(result);
      
    //   res.send(result);
    // })
    app.get('/browselisting', async(req,res)=>{
        const result = (await roomMateCollection.find().toArray());
        res.send(result);
    })
    app.get('/browsehexalisting', async(req,res)=>{
        const result = (await roomMateCollection.find().toArray()).slice(0,6);
        res.send(result);
    })

    
    // app.get('/details/:id', async(req,res) =>{
    //     const id = req.params.id;
    //     const query = {_id: new ObjectId(id) };
    //     const result = await roomMateCollection.findOne(query);
    //     res.send(result);
    //     console.log(result);
        
    // });


    app.get('/mylisting/:email', async (req,res)=>{
        const email = req.params.email;
        const query = {email:email};
        const findData = await roomMateCollection.find(query).toArray();
        res.send(findData);
        console.log("find data", findData);
    })
    app.get('/browselisting/:id', async (req,res)=>{
        const id = req.params.id;
        const query = {_id:new ObjectId(id)};
        const findData = await roomMateCollection.find(query).toArray();
        res.send(findData);
        console.log("find data", findData);
    })





     app.post('/addtofindroommate',async(req,res)=>{
        const newPost = req.body;
        console.log(newPost);
        const result = await roomMateCollection.insertOne(newPost);
        res.send(result);
    });

    



    app.delete('/browselisting/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      console.log(query);
      const result = await roomMateCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    app.put('/browselisting/:id', async (req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updatedPost = req.body;
      const updatePost = {
        $set: updatedPost
      }
      const result = await roomMateCollection.updateOne(filter,updatePost);
      res.send(result);
    })


    await client.connect();
   
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    
  }
}
run().catch(console.dir);

app.listen(port, ()=>{
    console.log("Roommate controlling ", port);
    
})