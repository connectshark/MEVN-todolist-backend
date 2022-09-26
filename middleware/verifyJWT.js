const jwt = require('jsonwebtoken')
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET

const verifyJWT = ( req, res, next ) => {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader?.startWith('Bearer ')) return res.sendStatus(401).json({ message: 'Unauthorized' })
  const token = authHeader.split(' ')[1]
  jwt.verify(
    token,
    ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.sendStatus(403).json({ message: 'Forbidden' })
      req.username = decoded.userInfo.username
      req.admin = decoded.userInfo.admin
      next()
    }
  )
}

module.exports = verifyJWT