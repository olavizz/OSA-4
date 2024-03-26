const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('username not valid', async () => {
    const newUser = {
        username: 'ab',
        name: 'abcdefg',
        password: 'salasana'
    }

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    assert.strictEqual(response.body.error, 'ValidationError')   
  })

  test('password not valid', async () => {
    const newUser = {
        username: 'Kalle123',
        name: 'Kalle',
        password: 'ab'
    }

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    
    assert.strictEqual(response.body.error, 'password not long enough')
  })

})

after(async () => {
    await mongoose.connection.close()
  })