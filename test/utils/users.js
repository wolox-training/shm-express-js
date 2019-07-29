const request = require('supertest');

const app = require('../../app');
const { User } = require('../../app/models');
const controller = request(app);

const userSignUp = {
  firstName: 'John',
  lastName: 'Katzenbach',
  email: 'john.katz@wolox.co',
  password: '12345678'
};

const userSignIn = {
  email: 'john.katz@wolox.co',
  password: '12345678'
};

const adminUser = {
  firstName: 'John',
  lastName: 'Katzenbach',
  email: 'john.katz@wolox.co',
  password: '$2b$10$YTRfEXPTYpumz.rYGhF19e0mR.iSztN5lWfGo3nIJkP5GpyCwG/Kq',
  role: 'admin'
};

exports.createAdmin = (user = adminUser) => User.create(user);

exports.signUp = () => controller.post('/users').send(userSignUp);

exports.signIn = (user = userSignIn) => controller.post('/users/sessions').send(user);
