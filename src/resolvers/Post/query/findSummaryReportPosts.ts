import { ObjectId } from 'bson';
import { UserInputError } from 'apollo-server-express';
import { SummaryReportArgs, Post } from '../../../types';

export default async function findSummaryReportPosts(_, args: SummaryReportArgs, context){
  try{
    const { archived, timer, category } = args

    let _id: ObjectId = new ObjectId(args?._id)

    if(!args?._id){
      throw new UserInputError('No _id, faied to retrieve sold items')
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