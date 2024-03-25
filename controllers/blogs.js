
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
blogsRouter.post('/', (request, response) => {
    const body = request.body
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
      .catch(error => {
        console.log(error)
        response.status(400).json(error)
      })
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