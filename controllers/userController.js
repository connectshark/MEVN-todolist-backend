const User = require('../models/User')

/**
 * @desc Get all users
 * @route GET /users
 * @access Private
 */
const getUser = async ( req, res ) => {
  const { id } = req.body
  if (!id) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  const user = await User.findById({ id }).lean()
  if (!user?.length) {
    return res.status(400).json({ message: 'No user found' })
  }
  res.json(user)
}

const createUser = async ( req, res ) => {
  const { line_id, username } = req.body
  if (!line_id || !username) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const duplicate = await User.findOne({ line_id }).lean().exec()

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate username' })
  }

  const user = await User.create({ line_id, username })

  if (user) {
    res.status(201).json({ message: `New user ${username} created` })
  } else {
    res.status(400).json({ message: 'Invalid user data received' })
  }
}

/**
 * @desc Update a user
 * @route PATCH /users
 * @access Private
 */
const updateUser = async ( req, res ) => {
  const { id, username } = req.body

  if (!id || !username) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'Task not found' })
  }

  user.username = username

  const updatedUser = await user.save()

  res.json({ message: `${updatedUser.id} updated` })
}

/**
 * @desc Delete a user
 * @route DELETE /users
 * @access Private
 */
const deleteUser = async ( req, res ) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: 'Task ID Required' })
  }

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }
  const result = await user.deleteOne()
  const reply = `content ${result.username} with ID ${result._id} deleted`
  res.json({ message: reply })
}


module.exports = {
  getUser,
  updateUser,
  createUser,
  deleteUser
}