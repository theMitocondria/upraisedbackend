import express from 'express';
import Blog from '../models/Blog.js';
import { allBlogs, createBlog, deleteBlog } from '../controllers/blog.js';
import multer from 'multer';
import upload from '../config/fileUpload.js';


const blog = express.Router();

blog.get('/all', allBlogs);
blog.post('/new', upload.single('image'), createBlog);
blog.delete('/delete', deleteBlog)

export default blog;