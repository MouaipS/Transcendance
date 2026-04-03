import fastify from 'fastify'

import  db  from "./db.js";

const server = fastify()

server.all('/*', async(request, reply) => {
	console.log("headers get", request.headers);
	console.log("body get", request.body);
	console.log("url get", request.url);
	console.log(typeof request.body);
	const users = db.prepare(`SELECT * FROM users`).all();
    console.log(users)
    reply.send(users);
    reply.send(201)
	return;
})

server.post('/api/login', async(request, reply) => {
	console.log("headers login", request.headers);
	console.log("body login", request.body);
	console.log("url login", request.url);
	const {username} = request.body as {username : string}
	const {password} = request.body as {password : string}
	const login = db.prepare(`SELECT * FROM users WHERE username = ? AND password = ?`).get(username, password);
	if (login === undefined)
		console.log("NULNUL")
	console.log("users : ", login);
	return;
})

server.post('/api/register', async(request, reply) => {
	console.log("headers register", request.headers);
	console.log("body register", request.body);
	console.log("url register", request.url);
	const {username} = request.body as {username : string}
	const {password} = request.body as {password : string}
	console.log("username : ", username);
	console.log("password : ", password);
	const result = db.prepare(`SELECT * FROM users WHERE username = ?`).get(username);
	if (result)
	{
		console.log("it exist alredi");
		return;
	}
    db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`).run(username, password);
	console.log("result : ", result);
	return;
})

server.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
