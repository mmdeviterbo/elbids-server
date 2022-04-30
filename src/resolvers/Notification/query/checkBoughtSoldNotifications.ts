import { UserInputError } from 'apollo-server-express'
import { NOTIFICATION_TYPE, UserFindManyArgs, Post, Item, InsertOneNotification, Notification } from '../../../types'
import { ObjectId } from 'mongodb'

export default async function checkBoughtSoldNotifications(_, args, context): Promise<Notification>{
  let posts: Post[] = await context.posts.find({
    seller_id: new ObjectId(args?.user_id),
    archived: true,
    deleted: false 
  }).toArray()
  
  if(posts?.length>0){
    posts?.forEach(async(post: Post): Promise<void>=>{
      let item: Item = await context.items.findOne({_id: new ObjectId(post?.item_id)})
      
      if(item?.buyer_id){
        let sellerNotifArgs: InsertOneNotification = {
          post_id: new ObjectId(post?._id),
          user_id: new ObjectId(post?.seller_id),    //change this
          type: NOTIFICATION_TYPE.SOLD,
        }
    
        let buyerNotifArgs: InsertOneNotification = {
          post_id: new ObjectId(post?._id),
          user_id: new ObjectId(item?.buyer_id),    //change this
          type: NOTIFICATION_TYPE.BOUGHT,
        }
    
        let isExist = await context.notifications.findOne({
          $or: [{ ... sellerNotifArgs }, { ...buyerNotifArgs }]
        })
  
        if(!isExist){
          let res = await context.notifications.insertMany(
            [
              {...sellerNotifArgs, date_created: new Date().toString(), read: false},
              {...buyerNotifArgs, date_created: new Date().toString(), read: false} 
            ]
          )
        }
      }
    })
  }
  return null
}