/** @format */

class Cache {
	constructor({ timeToExpire }) {
		this.timeToExpire = timeToExpire;
		this.cachedData = null;
	}

	clear() {
		this.cachedData = null;
	}

	/**

        @description method to store data in the cache. A new timestamp will be created. If the data is equal to the currently cached data, the data will not be overwritten.

        @param { {} } data - the object to store

        @returns { Boolean } true if the data was stored, false if it was not.

    */

	store(data) {
		/*

            If no stored data exists or the data is not equal to the data existing, simply store the data.

        */

		if (this.cachedData == null || !this.#compareData(data)) {
			this.cachedData = {
				timestamp: Date.now(),
				data,
			};

			return true;
		}

		return false;
	}

	/**

        @description method to compare the passed data against the cached data. 

        @param { {} } data - the data to check

        @returns { Boolean } true if the data is equal, false if it is not

    */

	#compareData(data) {
		// stringify both object to compare them against each other

		if (this.cachedData == null) return false;

		const dataString = JSON.stringify(data);
		const cachedString = JSON.stringify(this.cachedData.data);

		return dataString === cachedString ? true : false;
	}

	/**

        @description method to check a timestamp for expiration against the internal timeToExpire property 

        @param { Number } timestamp - point in time in ms when the data was created

        @returns { Boolean } true if the timestamp is expired, false if it is current enough

    */

	#checkIsExpired(timestamp) {
		if (this.data === null) {
			return new Error(`No Data.`);
		}

		// generate a new timestamp

		const current = Date.now();

		// if the timestamp of the data + the time to expire is smaller then current, return true, else false

		return timestamp + this.timeToExpire < current ? true : false;
	}

	/**

        @method to check a dataset for expiration. If no timestamp is contained within the data object, a new current one will be created. 

        @param { {} } data - Object that will be checked for expiration

        @returns { Boolean } true if the data is expired, false if it is current enough

    */

	testForExpiration(data = this.cachedData) {
		const timestamp = data?.timestamp || Date.now();

		return this.#checkIsExpired(timestamp);
	}

	/**

        @description method to update the data. The data will only be updated if it is not equal to the exitsting data. A new Timestamp will be created

        @param { {} } data - the data that will replace the current data

        @returns { Boolean } true if the data was updated, false if it was not

    */

	update(data) {
		if (!this.#compareData(data)) {
			this.cachedData = {
				timestamp: Date.now(),
				data,
			};

			return true;
		}

		this.cachedData.timestamp = Date.now();

		return false;
	}

	/**

		@description Method to compare a data set against the currently cached data object independently of the timestamp

		@param { {} } data - the data to check against

		@returns { Boolean } true if the data is equal, false if it is not

	*/

	testForEquality(data) {
		return this.#compareData(data);
	}
}

export { Cache };
