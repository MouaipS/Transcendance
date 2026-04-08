import fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify'
import {linker} from "../route/linker.js"

const server = fastify();

linker(server);
server.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => 
{
  if (err) 
	{
		console.error(err)
		process.exit(1)
  	}
  console.log(`Server listening at ${address}`)
})
