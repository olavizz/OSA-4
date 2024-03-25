const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blog = require('../models/blog')
const assert = require('node:assert')
const { initial } = require('lodash')

const api = supertest(app)

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  }
]

beforeEach(async () => {
  await blog.deleteMany({})
  let blogObject = new blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new blog(initialBlogs[1])
  await blogObject.save()
  blogObject = new blog(initialBlogs[2])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('objects id is named id', async () => {
  const response = await api.get('/api/blogs')
  console.log(response.body)
  
  response.body.forEach(element => {
    assert(element.hasOwnProperty('id'))
  });
})

test('blogs can be added', async () => {
  const newBlog = {
    title: 'GGG',
    author: 'Olavi',
    url: 'http://abcdefg',
    likes: 99
  }
  await api 
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const response = await api.get('/api/blogs')
  assert.deepStrictEqual(response.body.length, initialBlogs.length + 1)
})

test('blog without likes', async () => {
  const newBlog = {
    title: 'test without likes',
    author: 'Olavi',
    url: 'http://123344556'
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const response = await api.get('/api/blogs')
  console.log(response.body)
  assert.strictEqual(response.body[response.body.length-1].likes, 0)
})

test('blog without title or url responses with error 400', async () => {
  const newBlog = {
    author: 'Olavi'
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('delete succesful', async () => {
  console.log(initialBlogs[0]._id)
  await api
    .delete(`/api/blogs/${initialBlogs[0]._id}`)
    .expect(204)
  
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length-1)

})

test('updating succesful', async () => {
  const updatedLikes = {
    likes: 1000
  }
  await api
    .put(`/api/blogs/${initialBlogs[0]._id}`)
    .send(updatedLikes)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs/')
  assert.deepStrictEqual(response.body[0].likes, updatedLikes.likes)
})

after(async () => {
  await mongoose.connection.close()
})