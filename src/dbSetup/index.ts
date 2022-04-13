import { Db, MongoClient } from 'mongodb'
import collections from '../collectionSetup'

const returnDatabase = async (mongoClient : MongoClient)=>{
    const db : Db = mongoClient.db(process.env.DB_NAME)
    const database = collections(db)
    return database 
}
export default returnDatabase