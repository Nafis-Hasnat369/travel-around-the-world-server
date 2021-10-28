const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xu78k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const run = async () => {
    try {
        await client.connect();
        const database = client.db("travelGuru");
        const servicesCollection = database.collection("services");

        // GET API || all services
        app.get('/services', async (req, res) => {
            const services = await servicesCollection.find({}).toArray();
            res.send(services);
        });

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);




app.listen(port, () => {
    console.log("Server is running on", port);
})