import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import User from "../model/User.js";

const getAllBlogs = async (req,res,next)=>{
    let blogs;
    try {
        blogs = await Blog.find().populate("user")
    } catch (error) {
        return console.log(error)
    }
    if(!blogs){
        return res.status(404).json({message:"No Blogs Found"})
    }
    return res.status(200).json({blogs})
}

const addBlog = async(req,res,next)=>{
    const {title,description,img,user}=req.body
    let exsitingUser;
    try {
        exsitingUser = await User.findById(user)
    } catch (error) {
        return console.log(error)
    }
    if(!exsitingUser){
        return res.status(404).json({message: "Unable to Find user with this id"})
    }
    const newblog = new Blog({
        title,
        description,
        img,
        user
    })
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await newblog.save({session});
        exsitingUser.blogs.push(newblog);
        await exsitingUser.save({session});
        await session.commitTransaction();

    } catch (error) {
        return res.status(500).json({message: error})
    }
    return res.status(200).json({newblog})
}

const updateBlog = async (req,res,next)=>{
    const blogId = req.params.id;
    const {title,description,img} = req.body
    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(blogId,{
            title,
            description,
            img
        })
    } catch (error) {
        return console.log(error)
    }
    if(!blog){
        return res.status(500).json({message:"Unable to Update"})
    }
    return res.status(200).json({blog})
}

const getById = async(req,res,next)=>{
    const blogId = req.params.id
    let blog;
    try {
        blog = await Blog.findById(blogId).populate('user')
        await blog.user.blogs.pull(blog)
    } catch (error) {
        return console.log(error)
    }
    if(!blog){
        return res.status(404).json({message:"Blog not Found by the Id"})
    }
    return res.status(200).json({blog})
}
const deleteBlog = async(req,res,next)=>{
    const blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndRemove(blogId)        
    } catch (error) {
        return console.log(error)
    }
    if(!blog){
        return res.status(500).json({message:"Unable to Delete Blog"})
    }
    return res.status(200).json({message:"Successfully deleted"})
}

const getByUserId = async(req,res,next)=>{
    const userId = req.params.id; 
    let userBlogs
    try {
        userBlogs = await User.findById(userId).populate("blogs")
    } catch (error) {
        return console.log(error)
    }
    if(!userBlogs){
        return res.status(404).json({message:"User's Blogs are not Found"})
    }
    return res.status(200).json({user:userBlogs})
}


export {getAllBlogs,addBlog,updateBlog,getById,deleteBlog,getByUserId}