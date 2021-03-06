import * as express from 'express'
import { MongoClient, Db } from 'mongodb'

import findImageAsset from './asset/findImageAsset'
import insertImageGallery from './gallery/insertImageGallery'
import insertImageAsset from './asset/insertImageAsset';
import insertImageId from './id/insertImageId';
import findImageGallery from './gallery/findImageGallery';
import checkerTimerPosts from './checkerTimerPosts';

const utils = (app: express.Express, mongoClient: MongoClient)=>{
    const db : Db = mongoClient.db(process.env.DB_NAME)
    
    // assets
    findImageAsset(app, db)
    insertImageAsset(app, db)
    
    // gallery
    findImageGallery(app,db)
    insertImageGallery(app, db)

    // user image ids
    insertImageId(app, db)


    //run in the background
    setInterval(()=>{
        checkerTimerPosts(db)
    },5000)

}
export default utils