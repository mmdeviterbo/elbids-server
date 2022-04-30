import { UserInputError } from 'apollo-server-express'
import { ObjectId } from 'bson';
import { Post, User, InsertOneNotification, NOTIFICATION_TYPE } from '../../../types';

export default async function checkFollowingNotification(_, args, context): Promise<void>{
  const { _id, post_id, current_bid, date_latest_bid, buyer_id } = args

  try{
    let resUsers: User[] = await context.users.aggregate([
      {
        $lookup:{
          localField: "following_ids",
          from: "posts",
          foreignField:"_id",
          as: "postRes"
        }
      },
      {
        $match: { 
          "postRes._id": new ObjectId(post_id),
          _id: { $ne : new ObjectId(buyer_id) }
        }
      },
      {
        $project: { postRes: 0 }
      }
    ]).toArray()

    resUsers?.forEach(async(user: User): Promise<void>=>{
      let followingNotifArgs: InsertOneNotification = {
        post_id: new ObjectId(post_id),
        user_id: new ObjectId(user?._id),
        type: NOTIFICATION_TYPE.FOLLOWING
      }

      let isExist = await context.notifications.findOne({ ...followingNotifArgs })

      if(!isExist){
        await context.notifications.insertOne(
          { ...followingNotifArgs, current_bid, date_created: new Date().toString(), read: false }
        )
      }else{
        await context.notifications.updateOne(
          {...followingNotifArgs},
          { $set: { read: false, current_bid }}
        )

      }
    })
  }catch(err){
    throw new UserInputError('Failed to push notification')
  }
}