const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.port || 5000;
const cors = require("cors");

app.use(cors());
app.use(express.json());
// db access
// user: geniusUser
// pass: LvcUf17J3N8v0Ded

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uyqrh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function run() {
	try {
		await client.connect();
		const database = client.db("carMechanic");
		const servicesCollection = database.collection("services");

		// Get API
		app.get("/services", async (req, res) => {
			const cursor = servicesCollection.find({});
			const services = await cursor.toArray();
			res.send(services);
		});

		// Get Single API
		app.get("/services/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const service = await servicesCollection.findOne(query);
			res.json(service);
		});

		//Post API
		app.post("/services", async (req, res) => {
			console.log("hit the post api");
			const service = req.body;
			const result = await servicesCollection.insertOne(service);
			// console.log(result);
			res.json(result);
		});

		// Delete API
		app.delete("/services/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await servicesCollection.deleteOne(query);
			res.json(result);
		});
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Running Genius Server");
});

app.listen(port, () => {
	console.log("Running Genius Server on port", port);
});
