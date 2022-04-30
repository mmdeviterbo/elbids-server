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
  if([true,false].includes(deactivated)) userArgs.deactivated = deactivated
  if([true,false].includes(banned)) userArgs.banned = banned
  if([true,false].includes(admin)) userArgs.admin = admin
  
  const user = await context.users.findOne({ email })
  
  if(!user?.admin){
    throw new UserInputError('Unauthorized access')
  }

  const users =  await context.users.find({...userArgs}).toArray()
  return users
}