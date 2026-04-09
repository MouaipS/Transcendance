import fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify'
import {linker} from "../route/linker.js"
import { prisma } from "./prisma.js"

const server = fastify();

linker(server);

// async function main() {


//   // Create a new user with a post
//   // const user = await prisma.user.create({
//   //   data: {
//   //     username: "Alice",
//   //     },
//   //   },
//   // );
//   // console.log("Created user:", user);

//   // // Fetch all users with their posts
//   // const allUsers = await prisma.user.findMany({
//   // });
//   // console.log("All users:", JSON.stringify(allUsers, null, 2));
// }

// main()

server.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => 
{
  if (err) 
	{
		console.error(err)
		process.exit(1)
  	}
  console.log(`Server listening at ${address}`)
})
