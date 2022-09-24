const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'User'
  },
  created_at: {
    type: Date,
    immutable: true,
    default: Date.now
  },
  update_at: {
    type: Date,
    default: Date.now
  }
})

taskSchema.pre('save', function (next) {
  this.update_at = Date.now()
  next()
})

module.exports = mongoose.model('Task', taskSchema)