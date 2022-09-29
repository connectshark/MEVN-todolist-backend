const User = require('../models/User')
const Task = require('../models/Task')
const bcrypt = require('bcrypt')

/**
 * @desc Get all users
 * @route GET /user/
 * @access Private
 */
const getAllUsers = async ( req, res ) => {
  const users = await User.find().select('-password').lean()
  if (!users?.length) {
    return res.status(400).json({ message: 'No users found' })
  }
  res.json(users)
}
/**
 * @desc Get all users
 * @route GET /user/:id
 * @access Private
 */
const getUser = async ( req, res ) => {
  const { id } = req.body
  const user = await User.findById(id).select('-password').lean()
  if (!user?.length) {
    return res.status(400).json({ message: 'No users found' })
  }
  res.json(user)
}

const createNewUser = async ( req, res ) => {
  const { password, username } = req.body
  console.log(password, username)
  if (!password || !username) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const duplicate = await User.findOne({ username }).lean().exec()

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate username' })
  }

  const hashedPwd = await bcrypt.hash(password, 10)

  const user = await User.create({ password: hashedPwd, username })

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
  const { id, username, password, active } = req.body

  if (!id || !username || !password || !active) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  const duplicate = await User.findOne({ username }).lean().exec()

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username' })
  }

  user.username = username
  user.active = active

  if (password) {
    user.password = await bcrypt.hash(password, 10)
  }

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
  const task = await Task.findOne({ owner: id }).lean().exec()
  if (task) {
    return res.status(400).json({ message: `User has assigned task` })
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
  getAllUsers,
  updateUser,
  createNewUser,
  deleteUser,
  getUser
}