



const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      request.token = authorization.replace('Bearer ', '')
      console.log(request.token)
      console.log('gg')
    }
    next()
}
    


module.exports = {
  tokenExtractor
}