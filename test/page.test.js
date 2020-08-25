const app = require('../server');
const request = require('supertest');
const mongoose = require('mongoose');
const ejs = require('ejs');
const jsdom = require("jsdom");

let token;
require('dotenv').config();
beforeAll(() => {
  mongoose.connect(process.env.Db_Connection);
});

afterAll((done) => {
  mongoose.disconnect(done);
});

function getOutput(respText) {
  try {
    let data = JSON.parse(respText);
    let text = Array.from(data);
    let output = [];
    text.forEach((val) => {
      output.push(val.msg)
    });
    return output;
  }
  catch (e) {
    console.log(e);
    return;
  }
};

function getTextContent(htmldata) {
  let doc = new jsdom.JSDOM(htmldata.trim());
  let result = doc.window.document.querySelector('body').textContent.trim();
  return result;
};

test('should responds with html', async done => {
  const res = await request(app).get('/aboutus');
  expect(res.status).toBe(200);
  expect(res.headers['content-type']).toMatch('text/html');
  done();
});

test('should not create new user for empty fields', async done => {
  const res = await request(app).post('/register').send({ username: "test", email: "", password: "", password2: "" });
  let result = getOutput(res.text);
  let expected_result = ['please enter email', 'please enter valid email', 'please enter password', 'minimum 5 characters required', 'minimum 5 characters required', 'please enter confirm password'];
  expect(res.status).toBe(422);
  expect(result).toEqual(expected_result);
  done();
});

test('should not create new user when password is empty ', async done => {
  const res = await request(app).post('/register').send({ username: "test", email: "test@gmail.com", password: "", password2: "" });
  let result = getOutput(res.text);
  let expected_result = ['please enter password', 'minimum 5 characters required', 'minimum 5 characters required', 'please enter confirm password'];
  expect(res.status).toBe(422);
  expect(result).toEqual(expected_result);
  done();
});

test('should not create new user when passwords has minlength less than 5', async done => {
  const res = await request(app).post('/register').send({ username: "test", email: "test@gmail.com", password: "122", password2: "" });
  let result = getOutput(res.text);
  let expected_result = ['minimum 5 characters required', "Passwords don't match", 'please enter confirm password'];
  expect(res.status).toBe(422);
  expect(result).toEqual(expected_result);
  done();
});

test('should not create new user when confirm password empty', async done => {
  const res = await request(app).post('/register').send({ username: "test", email: "test@gmail.com", password: "12345", password2: "" });
  let result = getOutput(res.text);
  let expected_result = ["Passwords don't match", 'please enter confirm password'];
  expect(res.status).toBe(422);
  expect(result).toEqual(expected_result);
  done();
});

test('should not create new user when passwords not match', async done => {
  const res = await request(app).post('/register').send({ username: "test", email: "test@gmail.com", password: "12345", password2: "123456" });
  let result = getOutput(res.text);
  let expected_result = ["Passwords don't match"];
  expect(res.status).toBe(422);
  expect(result).toEqual(expected_result);
  done();
});

test('should not create new user for invalid email', async done => {
  const res = await request(app).post('/register').send({ username: "test", email: "testgmailcom", password: "12345", password2: "12345" });
  let result = getOutput(res.text);
  let expected_result = ["please enter valid email"];
  expect(res.status).toBe(422);
  expect(result).toEqual(expected_result);
  done();
});

test('should create new user', async done => {
  const res = await request(app).post('/register').send({ username: "test", email: "test@gmail.com", password: "12345", password2: "12345" });
  let result = getOutput(res.text);
  let expected_result = ["success"];
  expect(res.status).toBe(200);
  expect(result).toEqual(expected_result);
  done();
});

test('should not create existing user', async done => {
  const res = await request(app).post('/register').send({ username: "test", email: "test@gmail.com", password: "12345", password2: "12345" });
  console.log(res.text);
  let result = getOutput(res.text);
  let expected_result = ["username or email already exist, please try something new"]
  expect(res.status).toBe(422);
  expect(result).toEqual(expected_result);
  done();
});

test('should not login for incorrect username or password', async done => {
  const res = await request(app).post('/login').send({ username: "test", password: "1245" });
  let result = getOutput(res.text);
  let expected_result = ["incorrect username or password"];
  expect(res.status).toBe(422);
  expect(result).toEqual(expected_result);
  done();
});

test('should login', async done => {
  const res = await request(app).post('/login').send({ username: "test", password: "12345" });
  let result = getOutput(res.text);
  let expected_result = ["succesfully logged in"];
  token = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]);
  console.log("Token", token);
  expect(res.status).toBe(200);
  expect(result).toEqual(expected_result);
  done();
});

describe('GET /profile', () => {
  // token not being sent - should open default login page
  test('It should not show profile page, require authorization', () => {
    return request(app)
      .get('/profile')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        let currentPage;
        ejs.renderFile('./views/profile.ejs', { userName: "test", email: "test@gmail.com" }, {}, (err, str) => {
          if (!err) currentPage = getTextContent(str);
        });
        let output = getTextContent(response.text);
        expect(output).not.toEqual(currentPage);
      });
  });
  
  // send the token - should open profile page
  test('It should render Profile page', () => {
    return request(app)
      .get('/profile')
      .set('Cookie', token)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        let currentPage;
        ejs.renderFile('./views/profile.ejs', { userName: "test", email: "test@gmail.com" }, {}, (err, str) => {
          if (!err) currentPage = getTextContent(str);
        });
        let output = getTextContent(response.text);
        expect(output).toEqual(currentPage);
      });
  });
});