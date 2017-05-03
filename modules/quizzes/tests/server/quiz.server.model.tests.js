'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Quiz = mongoose.model('Quiz');

/**
 * Globals
 */
var user,
  quiz,
  quiz2;

/**
 * Unit tests
 */
describe('Quiz Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      quiz = new Quiz({
        topic: 'Topic Name',
        quizs: [{
          question: 'Question Name',
          questiontype: 'choice',
          choices: [{
            choice: 'Choice'
          }]
        }],
        user: user
      });

      quiz2 = new Quiz({
        topic: 'Topic Name',
        quizs: [{
          question: 'Question Name',
          questiontype: 'choice',
          choices: [{
            choice: 'Choice'
          }]
        }],
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return quiz.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without topic', function (done) {
      quiz.topic = '';

      return quiz.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save duplicate topic', function (done) {

      return quiz.save(function (err) {
        should.not.exist(err);
        quiz2.save(function (err) {
          should.exist(err);
          done();
        });

      });
    });

    it('should be able to show an error when try to save without question', function (done) {
      quiz.quizs = null;
      quiz.question = '';

      return quiz.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save duplicate question', function (done) {

      return quiz.save(function (err) {
        should.not.exist(err);
        quiz2.save(function (err) {
          should.exist(err);
          done();
        });

      });
    });

    it('should be able to show an error when try to save without quizs', function (done) {
      quiz.topic = 'Topic Name';
      quiz.quizs = null;

      return quiz.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save valid enum value for questiontype', function (done) {
      quiz.quizs = null;
      quiz.questiontype = 'choice';

      return quiz.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save answer', function (done) {

      if (quiz.users) {
        quiz.users.push(user);
        quiz.quizs[0].answers.push({
          user: user,
          answer: 'answer'
        });
      } else {
        quiz.users = [];
        quiz.users.push(user);

        quiz.quizs[0].answers=[];
        quiz.quizs[0].answers.push({
          user: user,
          answer: 'answer'
        });
      }
      return quiz.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

  });

  afterEach(function (done) {
    Quiz.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
