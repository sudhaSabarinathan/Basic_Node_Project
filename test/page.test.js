const app = require('../server');
const request = require('supertest');

test('should responds with html', async done => {
    const res = await request(app).get('/aboutus');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('text/html');
    done();
});