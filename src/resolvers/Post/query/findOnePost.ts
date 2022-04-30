import { ObjectId } from 'bson';
import { UserInputError } from 'apollo-server-express';

export default async function findOnePost(parent, args, context){
  try{
    if(parent?.post_id){
      return await context.posts.findOne({
        _id: new ObjectId(parent?.post_id)
      })
    }

    const {_id } = args
    
    const res = await context.posts.findOne({
      _id: new ObjectId(_id)
    })
    return res
  }catch(err){
    throw new UserInputError('Failed to retrieve a post')
  }
}