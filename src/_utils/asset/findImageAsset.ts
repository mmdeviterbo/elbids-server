import * as express from 'express'
import { Db } from 'mongodb'
import { ObjectId } from 'bson' 

export default function findImageAsset(app: express.Express, db: Db){
  app.post('/find-image-asset',async(req, res)=>{
    const _id = req.body._id 
    try{
        let result = await db.collection('assets').findOne({
            _id : new ObjectId(_id)
        })
        res.send(result)
    }catch(err){
        res.send('Error finding image')
    }
  })
}