# Welcome to the Geocode GraphQL API
This API uses the ```addresses.tar.gz``` as source data. It should be placed in the ```api/src/data``` folder. Create the folder and copy the tar.gz file to it.

## Requirements
- Nodejs (This app was created with Nodejs v10.13.0)

## Endpoint
This API has a single endpoint: ```http://localhost:8080/graphql```

## Query

> Visit http://localhost:8080/graphql in your browser once started to use a handy GraphQL Playground that is built in.
### Normal 

```js
//Query (using Alias 'normal')
{
  normal: getAddresses(limit:"2"){
    address
  }
}

//output
{
  "data": {
    "normal": [
      {
        "address": "346 Summer Ln, Maplewood, MN 55117, USA"
      },
      {
        "address": "344 Summer Ln, Maplewood, MN 55117, USA"
      }
    ],
  }
}

```
### geoJSON format

```js
//Query (using Alias 'geo')
{
  geo: getAddresses(limit:"2", format: "geoJSON"){
    type
    metadata{
      generated
      title
      status
      api
      count
    }
    features{
      type
      properties{
        place
      }
      geometry{
        coordinates
        type
      }
    },
  }
}

//output 
{
  "data": {
    "geo": [
      {
        "type": "FeatureCollection",
        "metadata": {
          "generated": "1558047194051",
          "title": "Addresses",
          "status": 200,
          "api": "1.0.0",
          "count": 2
        },
        "features": [
          {
            "type": "Feature",
            "properties": {
              "place": "346 Summer Ln, Maplewood, MN 55117, USA"
            },
            "geometry": {
              "coordinates": [
                -93.085594,
                44.9965369
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {
              "place": "344 Summer Ln, Maplewood, MN 55117, USA"
            },
            "geometry": {
              "coordinates": [
                -93.085737,
                44.996536
              ],
              "type": "Point"
            }
          }
        ]
      }
    ]
  }
}
```

### raw format
```js
//query
{
  getAddresses(limit: "1", format: "raw"){
    raw
  }
}

//output
{
  "data": {
    "getAddresses": [
      {
        "raw": "{\"address_components\":[{\"long_name\":\"346\",\"short_name\":\"346\",\"types\":[\"street_number\"]},{\"long_name\":\"Summer Lane\",\"short_name\":\"Summer Ln\",\"types\":[\"route\"]},{\"long_name\":\"Maplewood\",\"short_name\":\"Maplewood\",\"types\":[\"locality\",\"political\"]},{\"long_name\":\"Ramsey County\",\"short_name\":\"Ramsey County\",\"types\":[\"administrative_area_level_2\",\"political\"]},{\"long_name\":\"Minnesota\",\"short_name\":\"MN\",\"types\":[\"administrative_area_level_1\",\"political\"]},{\"long_name\":\"United States\",\"short_name\":\"US\",\"types\":[\"country\",\"political\"]},{\"long_name\":\"55117\",\"short_name\":\"55117\",\"types\":[\"postal_code\"]},{\"long_name\":\"2335\",\"short_name\":\"2335\",\"types\":[\"postal_code_suffix\"]}],\"formatted_address\":\"346 Summer Ln, Maplewood, MN 55117, USA\",\"geometry\":{\"location\":{\"lat\":44.9965369,\"lng\":-93.085594},\"location_type\":\"ROOFTOP\",\"viewport\":{\"northeast\":{\"lat\":44.9978858802915,\"lng\":-93.0842450197085},\"southwest\":{\"lat\":44.9951879197085,\"lng\":-93.08694298029151}}},\"place_id\":\"ChIJhS5HFp7VslIRnA0ypyWae5M\",\"plus_code\":{\"compound_code\":\"XWW7+JQ Maplewood, White Bear Township, MN, United States\",\"global_code\":\"86P8XWW7+JQ\"},\"types\":[\"street_address\"]}"
      }
    ]
  }
}
```


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
The server should be running at http://localhost:8080/graphql

# Tests
The test script is run automatically when you start the app. If any test fails the app will not start.
To manually run the test enter the following:
```bash
npm test
```


# geoJSON validation

The geoJSON format was validated at [http://geojson.io](http://geojson.io)


