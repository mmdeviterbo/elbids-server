import userMutation from "./User/mutation"
import userQuery from "./User/query"

import postMutation from './Post/mutation'
import postQuery from './Post/query'

import itemQuery from './Item/query'
import itemMutation from './Item/mutation'

import commentMutation from './Comment/mutation'
import commentQuery from './Comment/query'

import galleryQuery from './Gallery/query'

import messageQuery from './Message/query'
import messageMutation from './Message/mutation'

import notificationQuery from './Notification/query'
import notificationMutation from './Notification/mutation'


const {
  insertOneUser,
  updateOneUser
} = userMutation

const {
  findOneUser,
  findManyUsers,
  findTwoPersons,
  findOneIdImage
} = userQuery

const { 
  findManyPosts,
  findOnePost,
  findManyFavorites, 
  findManyBought,
  findManyFollowing,
  findManyMyPosts,
  findSummaryReportPosts,
  checkerTimerPosts,
  findFavoriteFollowingLength
} = postQuery


const { 
  insertPost,
  updateOnePost,
  deleteOnePost,
} = postMutation

const {
  findOneCoversation,
  findManyConversations,
  findManyMessages
} = messageQuery

const {
  insertOneConversation,
  insertOneMessage
} = messageMutation


const { findOneItem } = itemQuery
const { updateItem } = itemMutation

const { findOneGallery } = galleryQuery

const { insertOneComment } = commentMutation
const { findManyComments } = commentQuery

const { findManyNotifications } = notificationQuery
const { updateManyNotifications } = notificationMutation

const resolvers ={
  User:{
    id_image: async(parent, _, context)=>{
      return await findOneIdImage(parent,_, context)
    }
  },
	Post:{
		item: async(parent, _, context)=>{
      return await findOneItem(parent, _, context)
		},
    seller: async(parent, _, context)=>{
      return await findOneUser(parent, _, context)
    }
	},

  Comment:{
    user: async(parent, _, context)=>{
      return await findOneUser(parent, _, context)
    }
  },

  Item:{
    gallery: async(parent, _, context)=>{
      return await findOneGallery(parent, _, context)
    },
    buyer: async(parent, _, context)=>{
      return await findOneUser(parent, _, context)
    }
  },

  Conversation:{
    message: async(parent, _, context)=>{
      return await findManyMessages(parent, _, context)
    },
    users: async(parent, _, context)=>{
      return await findTwoPersons(parent, _, context)
    }
  },
  Message:{
    user: async(parent, _, context)=>{
      return await findOneUser(parent, _, context)
    }
  },
  Notification:{
    post: async(parent, args, context)=>{
      return await findOnePost(parent, args, context)
    }
  },

  Query:{
    // user
    async findOneUser(_, args, context){
        return await findOneUser(_, args, context)
    },
    async findManyUsers(_, args, context){
      return await findManyUsers(_, args, context)
    },
    async findOneConversation(_, args, context){
      return await findOneCoversation(_, args, context)
    },
    async findManyConversations(_, args, context){
      return await findManyConversations(_, args, context)
    },
    async findManyMessages(_, args, context){
      return await findManyMessages(_, args, context)
    },

    // post
    async findManyPosts(_, args, context){
      return await findManyPosts(_, args, context)
    },
    async findOnePost(_, args, context){
      return await findOnePost(_, args, context)
    },
    async findManyComments(_, args, context){
      return await findManyComments(_, args, context)
    },
    async findManyFavorites(_, args, context){
      return await findManyFavorites(_, args, context)
    },
    async findManyBought(_, args, context){
      return await findManyBought(_, args, context)
    },
    async findManyFollowing(_, args, context){
      return await findManyFollowing(_, args, context)
    },
    async findManyMyPosts(_, args, context){
      return await findManyMyPosts(_, args, context)
    },
    async findSummaryReportPosts(_, args, context){
      return await findSummaryReportPosts(_, args, context)
    },
    async findManyNotifications(_, args, context){
      return await findManyNotifications(_, args, context)
    },

    //checker timer posts in background
    async checkerTimerPosts(_, args, context){
      return await checkerTimerPosts(_, args, context)
    },

    async findFavoriteFollowingLength(_, args, context){
      return await findFavoriteFollowingLength(_, args, context)
    }
  },
  Mutation:{
    // user 
    async insertOneUser(_, args, context){
      return await insertOneUser(_, args, context)
    },

    async updateOneUser(_, args, context){
      return await updateOneUser(_, args, context)
    },

    // post
    async insertPost(_, args, context){
      return await insertPost(_, args, context)
    },
    async updateOnePost(_, args, context){
      return await updateOnePost(_, args, context)
    },
    async deleteOnePost(_, args, context){
      return await deleteOnePost(_, args, context)
    },

    //item
    async updateItem(_, args, context){
      return await updateItem(_, args, context)
    },

    //comment
    async insertOneComment(_, args, context){
      return await insertOneComment(_, args, context)
    },

    async insertOneConversation(_, args, context){
      return await insertOneConversation(_, args, context)
    },

    async insertOneMessage(_, args, context){
      return await insertOneMessage(_, args, context)
    },

    //notifications
    async updateManyNotifications(_, args, context){
      return await updateManyNotifications(_, args, context)
    }
  }
}
export default resolvers