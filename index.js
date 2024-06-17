const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
const jwt = require('jsonwebtoken')
require('dotenv').config()

app.use(cors())
app.use(express.json())

//database connection setup 

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vybo3pc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const userCollection = client.db('delivery-service').collection('users')
    //post users to database upon login

    app.post('/user', async(req,res)=>{
        const data = req.body
        console.log(req.body)
        const result = await userCollection.insertOne(data)
        res.send(result)
    })
    //get all the users 

    app.get('/users', async(req,res)=>{
        const result = await userCollection.find().toArray()
        res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res) => {
    res.send('Server is running')
})

app.listen(port, () =>{
    console.log('server is running on port' , port)
})
