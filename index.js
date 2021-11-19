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

        // Add a service

        app.post('/addServices', async (req, res) => {
            const result = await servicesCollection.insertOne(req.body);
            res.json(result);
        });

        // GET API || all services
        app.get('/services', async (req, res) => {
            const services = await servicesCollection.find({}).toArray();
            res.send(services);
        });
        // Get single service
        app.get('/singleProduct/:id', async (req, res) => {
            const id = req.params.id;
            const result = await servicesCollection.find({ _id: ObjectId(id) }).toArray();
            res.json(result[0]);
        });

        // ConfirmOrder
        app.post('/confirmOrder', async (req, res) => {
            const data = req.body;
            const result = await bookingsCollections.insertOne(data);
            res.json(result);
        });

        // Get my orders
        app.get('/myOrders/:email', async (req, res) => {
            const email = req.params.email;
            const result = await bookingsCollections.find({ email: email }).toArray();
            res.json(result);
        });
        // Delete an order
        app.delete('/cancelOrder/:id', async (req, res) => {
            const id = req.params.id;
            const result = await bookingsCollections.deleteOne({ _id: id });
            res.json(result);
        });
        // Get all orders
        app.get('/allOrders', async (req, res) => {
            const result = await bookingsCollections.find({}).toArray();
            res.json(result);
        });

        // Update Status
        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const newStatus = req.body.updatedStatus;
            const filter = { _id: id };
            const result = await bookingsCollections.updateOne(filter, {
                $set: { status: newStatus }
            });
            res.json(result);
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