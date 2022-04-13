import { ObjectId } from 'bson'
import { UserInputError } from 'apollo-server-express'

const deleteOnePost=async(_, args, context):Promise<void>=>{
  const { _id } = args

  if(!_id){
    throw new UserInputError('No post_id. Failed to delete post')
  }

  try{
    let res = await context.posts.findOneAndUpdate(
      { _id: new ObjectId(_id) }, 
      { $set:{ deleted: true } })
    return res.value
  }catch(err){
    throw new UserInputError('Failed to update post')
  }
}
export default deleteOnePost