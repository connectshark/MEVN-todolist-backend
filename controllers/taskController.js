const Task = require('../models/Task')

/**
 * @desc Get all users
 * @route GET /users
 * @access Private
 */
const getAllTasks = async ( req, res ) => {
  const tasks = await Task.find().lean()
  if (!tasks?.length) {
    return res.status(400).json({ message: 'No users found' })
  }
  res.json(tasks)
}

const createTask = async ( req, res ) => {
  const { content, id: owner } = req.body
  if (!content || !owner) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const task = await Task.create({ owner, content })

  if (task) {
    res.status(201).json({ message: `New task ${content} created` })
  } else {
    res.status(400).json({ message: 'Invalid user data received' })
  }
}

/**
 * @desc Update a user
 * @route PATCH /users
 * @access Private
 */
const updateTask = async ( req, res ) => {
  const { id, content } = req.body

  if (!id || !content) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const task = await Task.findById(id).exec()

  if (!task) {
    return res.status(400).json({ message: 'Task not found' })
  }

  task.content = content

  const updatedTask = await task.save()

  res.json({ message: `${updatedTask.id} updated` })
}

/**
 * @desc Delete a user
 * @route DELETE /users
 * @access Private
 */
const deleteTask = async ( req, res ) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: 'Task ID Required' })
  }

  const task = await Task.findById(id).exec()

  if (!task) {
    return res.status(400).json({ message: 'User not found' })
  }
  const result = await task.deleteOne()
  const reply = `content ${result.content} with ID ${result._id} deleted`
  res.json({ message: reply })
}


module.exports = {
  getAllTasks,
  updateTask,
  createTask,
  deleteTask
}