// const { gql } = require('apollo-server-express')
// module.exports = 
//   gql`
//   type Query {
//     well(wellName: ID!): Well
//     surveys(master: Boolean): [Survey]
//     survey(name: ID!): Survey!
//     master: [Survey!]
//   }

//   type Well {
//     wellName: ID!
//     uwi:      String!
//     wellType: String!
//     licensee: String!
//     lic: String!
//     surface:  String!
//     file: String!
//   }
//   type Survey{
//     data: [[Float!]]
//     name: ID!
//     elevation: Float!
//     surveyWell: Well!
//   }
//    `;
const { buildSchema } = require('graphql');
module.exports = buildSchema(`
  type Query {
    hello(msg: String) : String
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
