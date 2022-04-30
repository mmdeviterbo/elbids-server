import { UserInputError } from 'apollo-server-express'
import { ObjectId } from 'bson';

export default async function findOneIdImage(parent,_, context){
  if(!parent?.id) {
    throw new UserInputError('No id for image id query')
  }
  return await context.ids.findOne({ _id: new ObjectId(parent?.id) })
}