import { UserInputError } from 'apollo-server-express'

export default async(_, args, context)=>{
  const { email } = args
  try{
    const isExist = await context?.users?.findOne({ email })
    if(!isExist){
      const result = await context?.users?.insertOne({ ...args })
      return {_id: result?.insertedId, ... args}
    }else return isExist
  }catch(err){
    throw new UserInputError('Invalid user')
  }
}