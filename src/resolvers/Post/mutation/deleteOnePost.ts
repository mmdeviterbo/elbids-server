import { ObjectId } from 'bson'
import { UserInputError } from 'apollo-server-express'

const deleteOnePost=async(_, args, context)=>{
  const { _id } = args

  if(!_id){
    throw new UserInputError('No post_id. Failed to delete post')
  }

  try{
    await context.posts.updateOne(
      { _id: new ObjectId(_id) }, 
      { $set:{ deleted: true } })
    return null
  }catch(err){
    throw new UserInputError('Failed to update post')
  }
}
export default deleteOnePost