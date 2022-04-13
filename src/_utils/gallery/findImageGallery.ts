import * as express from 'express'
import { Db } from 'mongodb'
import { ObjectId } from 'bson' 

export default function findImageGallery(app: express.Express, db: Db){
  app.post('/find-image-gallery',async(req, res)=>{
    const ids: any[] = req.body.ids

    for(let i=0;i<ids.length;i++){
      ids[i] = new ObjectId(ids[i])
    }

    try{
        let result = await db.collection('gallery').find({
          '_id':{
            $in:[...ids]
          }
        }).toArray()
        res.send(result)
    }catch(err){
        res.send('Error finding the gallery')
    }
  })
}