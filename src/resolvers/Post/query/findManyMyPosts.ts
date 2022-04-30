import { ObjectId } from 'bson';
import { UserInputError } from 'apollo-server-express';
import { FindCartPostsArgs, Post } from '../../../types';

export default async function findManyMyPosts(_, args: FindCartPostsArgs, context){
  try{
    const { email, _id } = args
    
    if(!email && _id){
      throw new UserInputError('No email was provided, faied to retrieve favorite items')
    }

    const myPosts: Post[] = await context.posts.find({
      seller_id: new ObjectId(_id),
      deleted: false
    }).toArray()

    return myPosts
  }catch(err){
    throw new UserInputError('Failed to retrieve favorite posts')
  }
}