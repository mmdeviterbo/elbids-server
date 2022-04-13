import { ApolloServer } from 'apollo-server-express'
import { MongoClient } from 'mongodb'
import * as http from 'http'
import * as express from 'express'
import * as upload from 'express-fileupload'
import * as cors from 'cors'
import typeDefs from './typeDefs'
import resolvers from './resolvers';
import returnDatabase from './dbSetup'
import utils from './_utils'
import 'dotenv/config'
const path = require('path')


const app = express();
const MONGO_URI = process.env.MONGO_URI
// const PORT = process.env.NODE_ENV ==='production'? process.env.PROD_URI : process.env.DEV_URI
const PORT = process.env.DEV_URI || 3001


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
      context: ()=>returnDatabase(mongoClient)
    })

    utils(app, mongoClient)
    apolloServer.applyMiddleware({ app })

    const httpServer = http.createServer(app)
    httpServer.setTimeout(10 * 60 * 1000)

    app.use(express.static('public'))
    app.get('*', (req,res)=>{
      res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
    })

    httpServer.listen(PORT,(): void => {
        console.log(`Listening to port ${PORT}`)
    })
  }catch(err){
    console.log('Serverrr failed ' + err)
  }
}
server(app)