const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
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

userSchema.pre('save', function (next) {
  this.update_at = Date.now()
  next()
})

module.exports = mongoose.model('User', userSchema)