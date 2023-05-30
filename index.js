const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const app = express();
const port = process.env.PORT | 5000;



// middleware 

app.use(cors());
app.use(express.json());


app.get("/",(req,res) => {
    res.send("hello world")
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fclnk.mongodb.net/?retryWrites=true&w=majority`;

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
    const database = client.db("bistro");
    const menu = database.collection("menu");
    const carts = database.collection("carts");

    // my All routes 

    app.get('/menu',async (req,res) => {
        const cursor = await menu.find().toArray();
        res.send(cursor)
    })

    app.post('/cart',async (req,res) => {
        // const gmail = req.params.email;
        const data = req.body;
        const result = await carts.insertOne(data);
        
        res.send(result)
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





// listener 
app.listen(port,() => {
    console.log(`Server is running : ${port}`)
})