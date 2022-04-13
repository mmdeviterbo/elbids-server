import { PostUpdateArgs } from '../../../types'
import { ObjectId } from 'bson'
import { UserInputError } from 'apollo-server-express'


const updatePost=async(_, args: PostUpdateArgs, context):Promise<void>=>{
  const { _id, deleted, archived } = args

  const updateArgs: PostUpdateArgs = {}

  if(!_id){
    throw new UserInputError('No post_id. Failed to update post')
  }

  if(deleted){
    updateArgs.deleted = deleted
  }

  if(archived){
    updateArgs.archived = archived

  }

  try{
    let res = await context.posts.updateOne({ _id: new ObjectId(_id) }, {$set:{ ... updateArgs }})
    return res
  }catch(err){
    throw new UserInputError('Failed to update post')
  }
}
export default updatePost