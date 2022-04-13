import * as express from 'express'
import { Db } from 'mongodb'
import { ObjectId, Binary } from 'bson' 

export default function insertManyImagesItem(app: express.Express, db: Db){
  app.post('/insert-image-gallery',async(req:any, res)=>{
    let files = req?.files?.file
    let imageData: Binary[] = []

    if(Array.isArray(files)){
      files?.forEach((file)=>imageData.push(file.data))
    }else{
      imageData?.push(files.data)
    }

    try{
        const newFile = await db.collection('gallery').insertOne({ data : [ ...imageData ] })
        const result = await db.collection('gallery').findOne({ _id : new ObjectId(newFile?.insertedId) })
        res.send(result)
    }catch(err){
        res.send(null)
    }
  })
}