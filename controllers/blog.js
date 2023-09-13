import express from 'express';
import Blog from '../models/Blog.js';


export const allBlogs = async(req, res) => {
    try{
        const blogs =await Blog.find({});
        return res.status(200).json({
            message: "fectech successfully",
            success: true, 
            blogs
        })
    }catch(e){
        return res.status(500).json({
            message:`${e}`,
            success: false,
        })
    }
}

export const createBlog = async(req, res) => {
    try{
       
       const {title, subheading, description}  = req.body;
   
        // const image = "khfdasj"
       console.log(req.file);    
       const image = req.file.path;
        console.log(title, subheading, description, image);
    //    const imgbuffer = req.file.buffer.toString('base64'); 


        const blog = new Blog({title, subheading, description, image});
        await blog.save();

        return res.status(201).json({
            message:"blog created successfully", 
            success : true, 
            blog
        })

    }catch(e){
        return res.status(500).json({
            message:`${e}`,
            success: false,
        })
    }
}

export const deleteBlog = async(req, res) => {
    try{
       
        const {id} = req.body;

        const blog = await Blog.findOne({_id: id});
        if(!blog){
            return res.status(402).json({
                message:"NO SUCH BLOG FOUND",
                success: false,
            })
        }

        await Blog.deleteOne({_id: id});

        return res.status(200).json({
            message:"blog deleted",
            success: true,
        })
        
     }catch(e){
         return res.status(500).json({
             message:`${e}`,
             success: false,
         })
     }
}