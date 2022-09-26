const jwt = require('jsonwebtoken')
const User = require('../models/User')

/**
 * @desc Login
 * @route POST /auth
 * @access Public
 */
const line = async (req, res) => {
  const { code, state } = req.query
  const URI = process.env.REDIRECT_URI

  if (!code) {
    return res.redirect(URI + `?error=true&message=未正確認證`)
  }

  const fetch_token = await fetch('https://api.line.me/oauth2/v2.1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.LINE_REDIRECT_URI,
      client_id: process.env.LINE_CLIENT_ID,
      client_secret: process.env.LINE_CLIENT_SECRET
    })
  })
  const token_response = await fetch_token.json()

  const fetch_verify = await fetch(`https://api.line.me/oauth2/v2.1/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      id_token: token_response.id_token,
      client_id: process.env.LINE_CLIENT_ID
    })
  })
  const { sub: userId, name, email } = await fetch_verify.json()

  const user = await createUser({ line_id: userId, username: name })

  if (user.success) {
    const accessToken = jwt.sign(
      {
        userInfo: {
          username: name,
          email,
          userId
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    )
    res.redirect(URI + `?access_token=${accessToken}&success=true`)
  }
  
}

const createUser = async ({ line_id, username }) => {
  if (!line_id || !username) {
    return { err: true, message: 'All fields are required' }
  }

  const duplicate = await User.findOne({ line_id }).lean().exec()

  if (duplicate) {
    return { success: true, id: user._id, message: `Duplicate user ${username}` }
  }

  const user = await User.create({ line_id, username })

  if (user) {
    return { success: true, message: `New user ${username} created`, id: user._id }
  } else {
    return { err: true, message: 'Invalid user data received' }
  }
}

module.exports = {
  line
}