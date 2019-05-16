# Welcome to the Geocode GraphQL API
This API uses the ```addresses.tar.gz``` as source data. It should be placed in the ```api/src/data``` folder. Create the folder and copy the tar.gz file to it.

## Requirements
- Nodejs (This app was created with Nodejs v10.13.0)

## Endpoint
This API has a single endpoint: ```http://localhost:8080/v0/graphql```



## Installing the app
From the root directory:
```bash
npm i
```
> this will install all the dependencies

> For this app to run, you will need a valid [Google API key](https://developers.google.com/maps/documentation/geocoding/start#get-a-key), visit the link if you need to aquire one.

### envs.json
You will need to create an ```envs.json``` file in the root directory. Enter the following information:
```json
{
  "API_KEY": "Your_API_KEY_Here"
}
```

## Starting the app
From the root directory:
```bash
npm start
```

# Tests
The test script is run automatically when you start the app. If any test fails the app will not start.
To manually run the test enter the following:
```bash
npm test
```


# geoJSON validation

The geoJSON format was validated at [http://geojson.io](http://geojson.io)


