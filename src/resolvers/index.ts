import userMutation from "./User/mutation"
import userQuery from "./User/query"

import postMutation from './Post/mutation'
import postQuery from './Post/query'

import itemQuery from './Item/query'
import itemMutation from './Item/mutation'

import commentMutation from './Comment/mutation'
import commentQuery from './Comment/query'

import galleryQuery from './Gallery/query'

const { insertOneUser, updateOneUser } = userMutation
const { findOneUser, findManyUsers } = userQuery

const { findManyPosts, findOnePost } = postQuery
const { insertPost, updatePost, deleteOnePost } = postMutation

const { findOneItem } = itemQuery
const { updateItem } = itemMutation

const { findOneGallery } = galleryQuery

const { insertOneComment } = commentMutation
const { findManyComments } = commentQuery

const resolvers ={
	Post:{
		item: async(parent, _, context)=>{
      return await findOneItem(parent, _, context)
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


    // post
    async findManyPosts(_, args, context){
      return await findManyPosts(_, args, context)
    },
    async findOnePost(_, args, context){
      return await findOnePost(_, args, context)
    },
    async findManyComments(_, args, context){
      return await findManyComments(_, args, context)
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
    async updatePost(_, args, context){
      return await updatePost(_, args, context)
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
  }
}
export default resolvers