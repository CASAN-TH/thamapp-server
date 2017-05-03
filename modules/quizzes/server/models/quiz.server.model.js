'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Quiz Schema
 */
var QuizSchema = new Schema({
  topic: {
    type: String,
    required: 'Please fill Topic name',
    unique: true,
    trim: true
  },
  quizs: {
    type: [{
      question: {
        type: String,
        required: 'Please fill question',
        unique: true
      },
      questiontype: {
        type: String,
        enum: ['choice', 'none-choice'],
        require: 'Plese fill Questiontype'
      },
      choices: [{
        choice: String
      }],
      answers: [{
        user: {
          type: Schema.ObjectId,
          ref: 'User'
        },
        answer: String,
        date: {
          type: Date,
          default: Date.now
        }
      }]
    }],
    required: 'Please fill Quizs name',
  },
  users: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Quiz', QuizSchema);
