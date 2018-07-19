/**
 * @author: Robotic Eyes GmbH
 * Date   : 2018
 */
let express = require('express')
let http = require('http')
let ClientOAuth2 = require('client-oauth2')

let app = express()

let rexAuth = new ClientOAuth2({
  clientId: '<clientId>',
  clientSecret: '<clientSecret>',
  accessTokenUri: 'https://rex.robotic-eyes.com/oauth/token',
  authorizationUri: 'https://rex.robotic-eyes.com/oauth/authorize',
  redirectUri: 'http://localhost:3000/callback',
  scopes: ['PORTAL']
})

app.get('/login', (req, res) => {
  let uri = rexAuth.code.getUri()

  res.redirect(uri)
})

app.get('/callback', (req, res) => {
  rexAuth.code.getToken(req.originalUrl)
    .then((user) => {
      console.log(user)

      user.refresh().then((updatedUser) =>{
        console.log(updatedUser !== user)
        console.log(updatedUser.accessToken)
      })

      // you can now use the token in order to talk to the REX API

      return res.send(user.accessToken)
    })
})

const server = http.createServer(app)

server.listen(3000, () => {
  console.log("Started server on port 3000")
})
