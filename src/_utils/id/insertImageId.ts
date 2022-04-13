import * as express from 'express'
import { Db } from 'mongodb'

export default function insertImageId(app: express.Express, db: Db){
  app.post('/insert-image-id',async(req:any, res)=>{
    const file = req?.files?.file     //new formData() from client side 
    try{
        const newFile = await db.collection('ids').insertOne({
            ...file
        })
        res.send(newFile)
    }catch(err){
        res.send(null)
    }
  })
}