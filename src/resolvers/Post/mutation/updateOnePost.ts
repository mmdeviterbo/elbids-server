import { PostUpdateArgs } from '../../../types'
import { ObjectId } from 'bson'
import { UserInputError } from 'apollo-server-express'


const updateOnePost=async(_, args: PostUpdateArgs, context):Promise<void>=>{
  const { _id, archived, category } = args

  const updateArgs: PostUpdateArgs = {}

  if(!_id){
    throw new UserInputError('No post_id. Failed to update post')
  }

  if(archived){
    updateArgs.archived = archived
  }
  if(category){
    updateArgs.category = category
  }
  
  try{
    let res = await context.posts.findOneAndUpdate({ _id: new ObjectId(_id) }, {$set:{ ... updateArgs }})
    return res.value
  }catch(err){
    throw new UserInputError('Failed to update post')
  }
}
export default updateOnePost