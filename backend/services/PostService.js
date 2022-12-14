const { isValidObjectId } = require("mongoose")
const Post = require("../models/Post")

class PostService{

    constructor(){
        this.desc = "post service"
    }

    fetchTotalDocuments = async() => {
        const totalDocs = await Post.countDocuments({})
        return totalDocs
    }

    getAll = async({username}) => {
        let posts = null
        if(username != "") posts = await Post.find({username})
        else posts = await Post.find({})
        return posts
    }

    paginatePost = async(page=1, limit=5) => {
        
        try {
            if(page < 1) page = 1
            const posts = await Post.find({}).skip(page==1 ? 0 : (page-1)*limit).limit(limit)
            const total = await Post.countDocuments({}) //document
            return {
                total,
                page,
                itemsPerPage: posts.length,
                items: posts
            }
        } catch (error) {
            return {
                error: true,
                msgError: error
            }
        }
    }
    
    getById = async(id) => {
        try {
            if(!isValidObjectId(id)) throw new Error('id received is not a mongoID valid')
            const post = await Post.findById(id)
            return post   
        } catch (error) {
            return {
                error: true,
                msgError: error
            }
        }
    }

    createOne = async({username, title, image}) => {
        try {
            if(username == '' || username.includes(' ')) throw new Error('username should not void or content a spaces.')
            if(typeof(username) != 'string') throw new Error('username must be a string type.')
            if(title != undefined && typeof(title)!='string') throw new Error('title must be undefined or string type.')
            if(typeof(image)!='string') throw new Error('image must be a string type.')
            if(!(image.includes('https://', 0) || image.includes('http://', 0))) throw new Error('image must be a valid url.')
            const post = new Post({
                username,
                title,
                image
            })
            await post.save()
            return post   
        } catch (error) {
            return {
                error: true,
                msgError: error
            }
        }
    }

    addLike = async(id) => {
        try {
            if(!isValidObjectId(id)) throw new Error('id must be a MongoID type.')
            const {likes} = await Post.findById(id)
            const post = await Post.findByIdAndUpdate(id, {likes: likes + 1}, {new: true})
            return post   
        } catch (error) {
            return{
                error: true,
                msgError: error
            }
        }
    }

    deleteById = async(id) => {
        try {
            if(!isValidObjectId(id)) throw new Error('id received not is a mongoID valid')
            const post = await Post.findByIdAndDelete(id)
            return post
        } catch (error) {
            return{
                error: true,
                msgError: error
            }
        }
    }

    updatePost = async({id, title, image, username}) => {
        const post = await Post.findByIdAndUpdate(id, {title, image, username}, {new: true})
        return post
    }
}

const postService = new PostService()

module.exports = postService