const mongoose = require('mongoose');
const { Schema } = mongoose;

const userScema = new Schema({

  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  accountNumber: {
    type: String,
    required: true
  },


  bankName: {
    type: String,
    required: true
  },


  date: {
    type: Date,
    default: Date.now()
  },

  password: {
    type: String,
    required: true
  },

  bvn: {
    type: String,
    required: true
  }

});

module.exports = { User: mongoose.model('user', userScema) };