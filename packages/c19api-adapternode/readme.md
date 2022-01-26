<!-- @format -->

# 🚦 Covid-19 Bayern Adapter

This package is used to adapt the V2 API response to the level of the V1 API. This enables the consumer to have the same amount of detail with a significantly lowered payload.

## 🔧 Installing & Usage

```bash
npm install c19api-adapternode
```

The package is primarly thought to be used in a Node.js enviroment. However, accessing the package from a browser enviroment is also possible using the **unpkg cdn**.

```js
import { adaptData } from 'http://unpkg.com/c19api-adapternode';
```

After importing, use the function with the response from API to adapt the data.

```js
// import the package
import { adaptData } from 'c19api-adapternode';

// adapt the data
const parsedData = adaptData(apiResponse);
```

> Note: To adapt the response, it must contain the metaData returned by the response as well as at least 2 history entries.

## 📋 License

The package is licensed under the [MIT License](https://opensource.org/licenses/MIT).
