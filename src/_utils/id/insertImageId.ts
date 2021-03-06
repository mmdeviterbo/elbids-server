import * as express from 'express'
import { Db } from 'mongodb'
import { ObjectId, Binary } from 'bson' 

export default function insertImageId(app: express.Express, db: Db){
  app.post('/insert-image-id',async(req:any, res)=>{
    const file = req?.files?.file     //new formData() from client side 
    let imageData: Binary[] = []
    imageData.push(file?.data)
    try{
        const newFile = await db.collection('ids').insertOne({
            data: [...imageData]
        })
        res.send({_id: newFile?.insertedId})
    }catch(err){
        res.send(null)
    }
  })
}