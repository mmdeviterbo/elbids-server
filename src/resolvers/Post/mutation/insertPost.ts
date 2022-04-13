import { UserInputError } from 'apollo-server-express'
import { ObjectId } from 'bson'

export default async function insertPost(_, args, context){
  try{
    let post = { ...args }

    if(!post?.item?.post_id || !post?._id || !post.seller_id){
      throw new UserInputError('Incomplete item fields')
    }
    
    post._id = new ObjectId(post._id)
    post.category = post.category
    post.seller_id = new ObjectId(post.seller_id)
    post.item.gallery_id = new ObjectId(post.item.gallery_id)
    post.item.post_id = new ObjectId(post.item.post_id)

    const itemRes = await context?.items?.insertOne({...post.item})
    delete post.item
    const item_id = itemRes?.insertedId
    
    if(!item_id){
      throw new UserInputError('Processing of item failed')
    }
    
    const postRes = await context?.posts?.insertOne({...post})

    if(!postRes?.acknowledged) {
      throw new UserInputError('Item failed to add')
    }
    post._id = postRes?.insertedId
    return { ...post }
  }catch(err){
    throw new UserInputError('Item failed')
  }
}