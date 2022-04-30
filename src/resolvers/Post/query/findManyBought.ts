import { ObjectId } from 'bson';
import { UserInputError } from 'apollo-server-express';
import { FindCartPostsArgs, Post } from '../../../types';

export default async function findManyBought(_, args: FindCartPostsArgs, context){
  try{
    const { email, _id } = args
    
    if(!email && _id){
      throw new UserInputError('No email was provided, faied to retrieve favorite items')
    }

    const boughtPosts: Post[] = await context.posts.aggregate([
      {
        $lookup: {
            localField: "item_id",
            from: "items",
            foreignField: "_id",
            as: "soldItems"
        }
      },
      {
        $match:{ 'soldItems.buyer_id': new ObjectId(_id), archived: true, deleted: false }
      },
      {
        $project:{
          soldItems:0
        }
      }
    ]).toArray()

    return boughtPosts
  }catch(err){
    throw new UserInputError('Failed to retrieve favorite posts')
  }
}