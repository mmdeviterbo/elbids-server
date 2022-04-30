import { ObjectId } from 'bson';
import { UserInputError } from 'apollo-server-express';
import { FindCartPostsArgs, Post } from '../../../types';

export default async function findManyFavorites(_, args: FindCartPostsArgs, context){
  try{
    const { email, _id } = args
    
    if(!email){
      throw new UserInputError('No email was provided, faied to retrieve favorite items')
    }

    const favoritePosts: Post[] = await context.posts.aggregate([
      {
        $lookup: {
            localField: "_id",
            from: "users",
            foreignField: "favorite_ids",
            as: "user"
        }
      },
      {
        $match:{ 
          $or:[ {'user._id': new ObjectId(_id)}, {'user.email': email} ],
          deleted: false 
        }
      },
      {
        $project:{
          user:0
        }
      }
    ]).toArray()

    return favoritePosts
  }catch(err){
    throw new UserInputError('Failed to retrieve favorite posts')
  }
}