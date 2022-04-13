import { UserInputError } from 'apollo-server-express'
import { UserFindManyArgs } from '../../../types'

export default async function findManyUsers(_, args, context){
  const {
    email,
    status,
    deactivated,
    banned,
    admin,
  } = args
  const userArgs: UserFindManyArgs = {} 

  if(!email) {
    throw new UserInputError('Unauthorized access')
  }
  
  if(status) userArgs.status = status
  if(deactivated) userArgs.deactivated = deactivated
  if(banned) userArgs.banned = banned
  if(admin) userArgs.admin = admin
  
  const user = await context.users.findOne({ email })
  
  if(!user?.admin){
    throw new UserInputError('Unauthorized access')
  }

  const users =  await context.users.find({...userArgs}).toArray()
  return users
}