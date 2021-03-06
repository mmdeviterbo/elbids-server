import { ApolloServer } from 'apollo-server-express'
import { MongoClient } from 'mongodb'
import http from 'http'
import express from 'express'
import upload from 'express-fileupload'
import cors from 'cors'
import helmet from 'helmet'
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
    app.use(helmet())
    
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
  }catch(err){
    console.log('Serverrr failed ' + err)
  }
}
server(app)