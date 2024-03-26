
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

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

    const user = await User.findById(body.userId)

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

blogsRouter.delete('/:id', (request, response) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
})

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