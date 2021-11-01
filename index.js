const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

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
        const bookingsCollections = database.collection("bookings");

        // GET API || all services
        app.get('/services', async (req, res) => {
            const services = await servicesCollection.find({}).toArray();
            res.send(services);
        });

        // add to my bookings
        app.post('/myBookings', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await bookingsCollections.insertOne(data);
            // res.send(result);
        });

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log("Server is running on", port);
})