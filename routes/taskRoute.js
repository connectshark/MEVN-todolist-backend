const express = require('express')
const router = express.Router()
const taskController = require('../controllers/taskController')

router.route('/')
  .post(taskController.createTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask)

router.route('/:id')
  .get(taskController.getTasks)
module.exports = router