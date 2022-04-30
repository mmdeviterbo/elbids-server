import * as express from 'express'
import { Db } from 'mongodb'
import { ObjectId } from 'bson' 

export default function findImageAsset(app: express.Express, db: Db){
  app.post('/find-image-asset',async(req, res)=>{
    let _id = req.body._id 
    _id = _id?.map((tempId: string)=>new ObjectId(tempId))
    try{
        let result = await db.collection('assets').aggregate([
         { $match:  { _id: { $in: [..._id] } } },
         { $project: { data:1, _id: 0 } }
      ]).toArray()
      res.send(result)
    }catch(err){
        res.send('Error finding image')
    }
  })
}