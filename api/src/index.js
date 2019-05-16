'use strict'

const express = require('express')
const envs = require('../../envs')
const schema = require('./schema')
const resolvers = require('./resolvers')
const port = process.env.PORT || envs.get('PORT')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const graphqlHTTP = require('express-graphql');

app.use(bodyParser.json());
app.use(cors({credentials: true}))


app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
}));

app.listen({ port: port }, () => {
  console.info(`GraphQL Server on http://localhost:${port}/graphql`)
})

