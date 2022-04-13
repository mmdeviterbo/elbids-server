import { UserInputError } from 'apollo-server-express'
import { ObjectId } from 'bson'

export default async function insertPost(_, args, context){
  try{
    const { post_id } = args
    
    if(!post_id){
      throw new UserInputError('Post id is null')
    }
    const res = await context.comments.find({ 
      post_id : new ObjectId(post_id), 
      deleted: false
    }).toArray()
    return res
  }catch(err){
    throw new UserInputError('Find many comments failed')
  }
}