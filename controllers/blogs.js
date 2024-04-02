
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
      .find({})
      .populate('user', {username: 1, name: 1, id: 1})
    console.log(blogs)
    response.json(blogs)
  })
  
blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid'})
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })
  
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog)
      } catch (error) {
        console.log(error)
        response.status(400).json(error)
      }
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  try {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log(decodedToken.id)
  if (!decodedToken.id) {
    return response.status(401).json({error: 'token invalid'})
  }
  console.log(decodedToken)
  console.log(decodedToken.id)
  const user = await User.findById(decodedToken.id)
  console.log(user._id)
  console.log(blog)



  if (blog.user.toString() !== user._id.toString()) {
    return response.status(400).json({error: 'blog and user dont match'})
  }
  await Blog.findOneAndDelete(blog._id)
  response.status(204).json({message: 'delete succesful'})

  }
 catch(error) {
  console.log(error)
  response.status(400).json(error)
} })

blogsRouter.put('/:id', (request, response) => {
  const body = request.body

  const blog = {
    likes: body.likes
  }

  Blog.findByIdAndUpdate(request.params.id, blog)
  .then(updatedBlog => {
    response.status(200).json(updatedBlog)
  })
})

module.exports = blogsRouter