import { UserInputError } from 'apollo-server-express';
import { ObjectId } from 'bson'
import { InsertCommentArgs } from '../../../types'

export default async function insertOneComment(_, args: InsertCommentArgs, context){
  try{
    const { user_id, post_id, content, deleted } = args
    
    const resComment = await context.comments.insertOne({
      user_id: new ObjectId(user_id),
      post_id: new ObjectId(post_id),
      content,
      deleted
    })
    return { _id : resComment?.insertedId }
  }catch(err){
    throw new UserInputError('Insert comment failed')
  }
}