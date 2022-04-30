import { ObjectId } from 'bson';
import { UserInputError } from 'apollo-server-express';
import { SummaryReportArgs, Post } from '../../../types';

export default async function findSummaryReportPosts(_, args: SummaryReportArgs, context){
  try{
    const { archived, timer, category } = args

    let _id: ObjectId = new ObjectId(args?._id)

    if(!args?._id){
      throw new UserInputError('No _id, faied to retrieve sold items')
    }else{
      let res = await context.users.findOne({ _id })
      if(!res?.admin) throw new UserInputError('Unauthorizated access, faied to retrieve posts')
    }

    let summaryReportArgs: SummaryReportArgs = {}
    
    if([true,false].includes(archived)) summaryReportArgs.archived = archived 
    if(timer) summaryReportArgs.timer = timer
    if(category) summaryReportArgs.category = category

    const posts: Post[] = await context.posts.find({ ...summaryReportArgs, deleted: false }).toArray()
    return posts
  }catch(err){
    throw new UserInputError('Failed to retrieve summary report posts')
  }
}