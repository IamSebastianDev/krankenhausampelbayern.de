/** @format */

// connecting to the mongo db

import './dotenv.config.mjs';
import mongoDB from 'mongodb';

const MongoClient = mongoDB.MongoClient;

/**
 *
 * A method to access the DB with a specified collection, executing a callback on that specified collection. The
 * callback will receive the collection as parameter. This is a minimal wrapper for the mongodb client and ensures that
 * not to many concurrent connections are opened and connections are closed after the callback is exectuted
 *
 * @param { string } collectionName - the name of the collection to operate on
 * @param { function } callback - the callback to exectute, receives the collection as it's parameter
 *
 * @returns { * | Error } either the result of the callback or any created error
 */

export const accessDB = async (collectionName, callback) => {
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
		client.close();
		return e;
	}
};
