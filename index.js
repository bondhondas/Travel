const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// MongoDB START
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nki2v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("travel");
        const a = database.collection("data");
        const b = database.collection("b");
        const c = database.collection("c");

        app.get('/tours', async (req, res) => {
            const email = req.query.email;
            let query;
            let cursor;

            if (email) {
                query = { email: email };
                cursor = b.find(query);
            }

            else {
                query = {};
                cursor = a.find(query);
            };

            const events = await cursor.toArray();
            res.send(events);
        });

        app.get('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = a.findOne(query);
            const event = await cursor;
            res.send(event);
        });

        app.post('/tours', async (req, res) => {
            const tour = req.body;
            const result = await a.insertOne(tour);
            res.send(result);
        });

        app.delete('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await products.deleteOne(query);
            res.send(result);
        });

        app.put('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tour = req.body;
            const updateDoc = {
                $set: {
                    name: tour.name,
                    price: tour.price,
                    image: tour.image,
                    description: tour.description,
                    duration: tour.duration
                },
            };
            const result = await a.updateOne(query, updateDoc);
            res.send(result);
        });

        app.get('/orders', async (req, res) => {
            const id = req.query.id;
            const email = req.query.email;

            let query;
            let cursor;
            let orders;

            if (id) {
                query = { _id: ObjectId(id) };
                cursor = b.findOne(query);
                orders = await cursor;
            }

            else if (email) {
                query = { email: email };
                cursor = b.find(query);
                orders = await cursor.toArray();
            }

            else {
                query = {};
                cursor = b.find(query);
                orders = await cursor.toArray();
            }
            res.send(orders);
        });

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await b.insertOne(order);
            res.send(result);
        });

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await b.deleteOne(query);
            res.send(result);
        });

        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = req.body;
            const updateDoc = {
                $set: {
                    name: order.name,
                    email: order.email,
                    phone: order.phone,
                    date: order.date,
                    tourName: order.tourName,
                    price: order.price,
                    image: order.image,
                    description: order.description,
                    duration: order.duration,
                    status: order.status
                },
            };
            const result = await b.updateOne(query, updateDoc);
            res.send(result);
        });

        app.post('/contact', async (req, res) => {
            const info = req.body;
            const result = await c.insertOne(info);
            res.send(result);
        });
    }

    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Server Running");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});