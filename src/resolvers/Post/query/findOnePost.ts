import { ObjectId } from 'bson';
import { UserInputError } from 'apollo-server-express';

export default async function findOnePost(_, args, context){
  try{
    const {_id, deleted, archived } = args
    const res = await context.posts.findOne({
      _id: new ObjectId(_id),
      deleted,
      archived
    })
    return res
  }catch(err){
    throw new UserInputError('Failed to retrieve a post')
  }
}