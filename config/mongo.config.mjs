/** @format */
/** @format */

// connecting to the mongo db

import dotenv from './dotenv.config.mjs';
import mongoDB from 'mongodb';

const MongoClient = mongoDB.MongoClient;

// the callback parameter is a function that gets executed with the collection as a parameter

const accessDB = async (collectionName, callback) => {
	// create a new client
	const client = new MongoClient(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	try {
		// connect to the client and find the correct collection
		await client.connect();

		const collection = client
			.db(process.env.DB_NAME)
			.collection(collectionName);

		// initiate the callback and pass the collection to it
		let result = await callback(collection);

		// close the client
		client.close();

		// return the result
		return result;
	} catch (e) {
		// return the error
		return e;
	}
};

export { accessDB };
