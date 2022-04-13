import * as express from 'express'
import { Db } from 'mongodb'
import { ObjectId } from 'bson' 

export default function insertImageAsset(app: express.Express, db: Db){
  app.post('/insert-image-asset',async(req:any, res)=>{
    const file = req?.files?.file     //new formData() from client side 
    try{
        const newFile = await db.collection('assets').insertOne({
            ...file
        })
        const result = await db.collection('assets').findOne({
            _id : new ObjectId(newFile.insertedId)
        })
        res.send(result)
        // res.send(true)
    }catch(err){
        res.send(null)
    }
  })
}