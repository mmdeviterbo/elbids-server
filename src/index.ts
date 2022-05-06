import { ApolloServer } from 'apollo-server-express'
import { MongoClient } from 'mongodb'
import http from 'http'
import express from 'express'
import upload from 'express-fileupload'
import cors from 'cors'
import typeDefs from './typeDefs'
import resolvers from './resolvers';
import returnDatabase from './dbSetup'
import utils from './_utils'
import 'dotenv/config'

const app = express();
const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT || 8080

const server = async(app : express.Express): Promise<void> =>{
  try{
    const mongoClient = new MongoClient(MONGO_URI)
    await mongoClient.connect()

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(upload())
    app.use(cors())
    
    const apolloServer = new ApolloServer({ 
      typeDefs, 
      resolvers,
      context: ()=>returnDatabase(mongoClient),
      introspection: true,
      playground: true,
    })

    utils(app, mongoClient)
    apolloServer.applyMiddleware({ app })

    const httpServer = http.createServer(app)
    httpServer.setTimeout(10 * 60 * 1000)
    httpServer.listen(PORT,(): void => {
        console.log(`Listening to port ${PORT}`)
    })

    setInterval(function() {
      http.get("https://elbids.herokuapp.com/graphql");
    }, 300000); // every 5 minutes (300000)

  }catch(err){
    console.log('Serverrr failed ' + err)
  }
}
server(app)