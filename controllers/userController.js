const User = require('../models/User')
const Task = require('../models/Task')

/**
 * @desc Get all users
 * @route GET /user/:id
 * @access Private
 */
const getUser = async ( req, res ) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  const user = await User.findById({ _id: id }).lean()
  if (!user?.username) {
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
    return res.status(400).json({ message: 'User not found' })
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

/**
 * @desc Get all users
 * @route GET /users
 * @access Private
 */
const getAllUsers = async ( req, res ) => {
  const users = await User.find().lean()
  if (!users?.length) {
    return res.status(400).json({ message: 'No users found' })
  }
  res.json(users)
}

module.exports = {
  getUser,
  updateUser,
  createUser,
  deleteUser,
  getAllUsers
}