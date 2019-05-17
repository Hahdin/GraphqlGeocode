const { buildSchema } = require('graphql');
module.exports = buildSchema(`
   type Query {
      getAddresses(limit: String, offset: String, format: String) : [Address]
   }

   type Address{
      address: String
      lat: Float
      lng: Float
      features: [Feature]
      metadata: Metadata
      type: String
   }
   
   type Metadata{
      api: String
      count: Int
      generated: String
      status: Int
      title: String
   }

   type Feature {
      geometry : Geometry
      properties: Properties
      type: String
   }

   type Properties {
      place: String
   }

   type Geometry{
      coordinates: [Float]
      type: String
   }
`);
