import { UserInputError } from 'apollo-server-express'
import { ObjectId } from 'bson';
export default async function findOneGallery(parent, _, context){
  if(!parent?.gallery_id){
    throw new UserInputError('No gallery id for this user')
  }
  return await context.gallery.findOne({ _id : new ObjectId(parent.gallery_id) })
}