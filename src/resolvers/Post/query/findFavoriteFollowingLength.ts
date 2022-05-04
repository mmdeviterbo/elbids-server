import { Post } from '../../../types'
import { ObjectId } from 'bson';
import { UserInputError } from 'apollo-server-express';


export default async(_, args, context)=>{
  if(!args?.post_id) throw new UserInputError('No post_id')
  
  let post_id: ObjectId = new ObjectId(args?.post_id)

  try{
    let followingPosts = await context.users.find({
      following_ids: post_id
    }).toArray()
  
    let favoritePosts = await context.users.find({
      favorite_ids: post_id
    }).toArray()
    
    let lenFollowingPosts = followingPosts?.length || 0
    let lenFavoritePosts = favoritePosts?.length || 0

    return {
      lenFollowingPosts,
      lenFavoritePosts
    }

  }catch(err){
    throw new UserInputError('Failed to retrieve length favorite-following posts')
  }  
}