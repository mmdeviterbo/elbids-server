import { gql } from 'apollo-server-express'

const typeDefs = gql`
	type Gallery{
		_id: ID
		data: [String]
	}

  type User{
		_id: ID
	  email : String!
    first_name : String!
  	last_name : String!
	  full_name: String!
		imageUrl: String!
		date_created : String!
		status: String!
		token: String!
		id: ID
		admin: Boolean
		deactivated : Boolean	  #is deactivated
	  banned : Boolean	      #is dismissed
	  report_count : Int	    #if report count > 5, banned : true
  	notification_count: Int
	  
		following_ids: [ID]
	  like_ids: [ID]
	}

	type Item{
		_id: ID
		post_id: ID!
		title: String!
		description: String!
		reason: String!

		starting_price: Int!
		additional_bid: Int!
		current_bid: Int!
		timer: String!
		date_first_bid: String
		date_latest_bid: String
		buyer_id: ID

		gallery: Gallery
		gallery_id:ID!
		tags: [String!]!
		date_created : String!
		date_updated  : String
	}

	input ItemInput{
		_id: ID
		post_id: ID!
		title: String!
		description: String!
		reason: String!

		starting_price: Int!
		additional_bid: Int!
		current_bid: Int!
		timer: String!
		date_first_bid: String
		date_latest_bid: String
		buyer_id: ID

		gallery_id:ID!
		tags: [String!]!
		date_created : String!
		date_updated  : String
	}

	type Post{
		_id: ID!
		seller_id : ID!
		category: String!
		item: Item!
		deleted : Boolean!
		archived: Boolean!	#item already bought
	}

	type Comment{
		_id: ID
		user_id : ID!
		user: User
		post_id : ID!
		content : String!
		deleted : Boolean
	}

	type Query{
		findOneUser(
			email: String
			_id: ID
		): User
		
		findManyUsers(
			email: String!,
			status: String,
			deactivated: String,
			banned: String,
			admin: String
		): [User]

		findManyPosts(
			search: String, 
			min_price: Int,
			max_price: Int,
			tags: [String], 
			timer: String,
			date_range: String					#to find time remaining
			category: String
		): [Post]

		findOnePost(
			_id: ID!
			deleted : Boolean!
			archived: Boolean!
		):Post

		findManyComments(
			post_id: ID!
		): [Comment]

		findOneGallery(
			_id: ID!
		): Gallery
	}

	type Mutation{
		insertOneUser(
			email: String!
  		full_name: String! 
  		first_name: String! 
  		last_name: String! 
  		imageUrl: String! 
  		status: String!
			date_created: String!
  		deactivated: Boolean
  		banned:Boolean
  		report_count:Int
  		notification_count:Int
			token: String!
			admin: Boolean
		): User

		updateOneUser(
			email: String
			status: String
  		deactivated: Boolean
  		banned:Boolean
  		report_count:Int
  		notification_count:Int
			id: ID
			admin: Boolean
			following_id: ID
			like_id: ID
		): User

		insertPost(
			_id: ID!
			seller_id : ID!
			category: String!
			item: ItemInput!
			deleted : Boolean!
			archived: Boolean!
		): Post

		updatePost(
			_id: ID
			deleted: Boolean
			archived: Boolean
			category: String
		): Post

		updateItem(
			_id: ID
			post_id: ID
			title: String
			description: String
			reason: String
			date_updated: String
			current_bid: Int
			date_first_bid: String
			date_latest_bid: String
			buyer_id: ID
			following_ids: [ID]
		): Item

		insertOneComment(
			user_id : ID!
  		post_id : ID!
  		content : String!
  		deleted : Boolean!
		): Comment

		updateOnePost(
			_id: ID
    	archived: Boolean
    	deleted: Boolean
		): Post

		deleteOnePost(
			_id: ID!
		): Post
			
	}
`
export default typeDefs