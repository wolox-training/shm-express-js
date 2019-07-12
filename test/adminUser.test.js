const request = require('supertest');
const dictum = require('dictum.js');

const app = require('../app');
const { User } = require('../app/models');

const controller = request(app);

const adminUser = {
  firstName: 'John',
  lastName: 'Katzenbach',
  email: 'john.katz@wolox.co',
  password: '$2b$10$YTRfEXPTYpumz.rYGhF19e0mR.iSztN5lWfGo3nIJkP5GpyCwG/Kq',
  role: 'admin'
};

describe('POST /admin/users', () => {
  test('Successful test when registering admin user', () =>
    User.create(adminUser)
      .then(() =>
        controller.post('/users/sessions').send({
          email: 'john.katz@wolox.co',
          password: '12345678'
        })
      )
      .then(({ body }) =>
        controller
          .post('/admin/users')
          .set({ token: body.token })
          .send({
            firstName: 'Jose',
            lastName: 'Perez',
            email: 'jose.perez@wolox.com.ar',
            password: '12345test'
          })
      )
      .then(response => {
        User.findOne({
          where: { email: 'jose.perez@wolox.com.ar' }
        }).then(({ firstName, lastName, email, role }) => {
          expect({ firstName, lastName, email, role }).toStrictEqual({
            firstName: 'Jose',
            lastName: 'Perez',
            email: 'jose.perez@wolox.com.ar',
            role: 'admin'
          });
          dictum.chai(response, 'Successful test creating admin user');
        });
      }));

  test('Successful test when updating regular user to administrator', () =>
    User.create(adminUser)
      .then(() =>
        controller.post('/users').send({
          firstName: 'Jose',
          lastName: 'Perez',
          email: 'jose.perez@wolox.com.ar',
          password: '12345678',
          confirm_password: '12345678'
        })
      )
      .then(() =>
        controller.post('/users/sessions').send({
          email: 'john.katz@wolox.co',
          password: '12345678'
        })
      )
      .then(({ body }) =>
        controller
          .post('/admin/users')
          .set({ token: body.token })
          .send({
            firstName: 'Jose',
            lastName: 'Perez',
            email: 'jose.perez@wolox.com.ar',
            password: '12345678'
          })
      )
      .then(response => {
        expect({ status: response.statusCode, message: response.body.message }).toStrictEqual({
          status: 201,
          message: 'User Jose updated to admin'
        });
        dictum.chai(response, 'Successful test updating regular user to administrator');
      }));
});
