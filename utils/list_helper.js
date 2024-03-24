const _ = require('lodash')

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    return blogs.reduce((summa, blogi) => summa + blogi.likes, 0)
}

const favoriteBlog = (blogs) => {
    let favorite = blogs.reduce((max, blogi) =>
        blogi.likes > max.likes ? blogi : max, blogs[0])
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
    }

const mostBlogs = (blogs) => {
    const blogsAuthors = _.groupBy(blogs, 'author')
    let mostA = blogsAuthors[0]
    let mostB = 0
    Object.values(blogsAuthors).forEach(function(objc) {
        if (objc.length > mostB) {
            mostB = objc.length
            mostA = objc[0].author
        }
    })
    console.log(mostB)
    console.log(mostA)
    return {
        author: mostA,
        blogs: mostB
    }
}

const mostLikes = (blogs) => {
    const likesAuthors = _.groupBy(blogs, 'author')
    console.log(likesAuthors)
    let mostAuth = likesAuthors[0]
    let mostLK = 0

    Object.values(likesAuthors).forEach(function(objc) {
        const summa = totalLikes(objc)
        if (summa > mostLK) {
            mostLK = summa
            mostAuth = objc[0].author
        }
    })
    console.log(mostLK)
    console.log(mostAuth)
    return {
        author: mostAuth,
        likes: mostLK
    }

}

  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }