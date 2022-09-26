const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const adminController = require('../controllers/taskController')

router.route('/user')
  .get(userController.getAllUsers)
  .post(userController.createUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

router.route('/task')
  .get(adminController.getAllTasks)
  .post(adminController.createTask)
  .patch(adminController.updateTask)
  .delete(adminController.deleteTask)
module.exports = router