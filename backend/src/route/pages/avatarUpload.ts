import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"
import { pipeline } from 'stream/promises' //plugins that will connect the file into a write stream 
import fs from 'fs' //file system
import path from 'path' //for building file paths

export async function avatarUploadRoute(request : FastifyRequest, reply : FastifyReply)
{
	const AVATARS_DIR = path.join(process.cwd(), 'uploads', 'avatars');
	fs.mkdirSync(AVATARS_DIR, { recursive: true }); //build and create the file if it doesn't exist
	const user = request.user as { id: string }
	const username = request.user as {username : string}
	const data = await request.file()//read the uploaded file from the multipart request body
	if (!data)
	{
		return reply.code(400).send({message: 'No file provided'}) // check for file
	}
	if (!data.mimetype.startsWith('image/')) //this checks if the file is an image by checking the type with mimetype
	{
  		return reply.code(400).send({ message: 'File must be an image' })//MIME type describes what kind of data a file contains the format is always 'type/subtype'
	}
	//LOGIC TO REPLACE FILE NAME BY USERNAME
	const ext = path.extname(data.filename) || '.png';
	const filename = `${username.username}${ext}`;
	const filePath = path.join(AVATARS_DIR, filename);
	for (const oldFile of fs.readdirSync(AVATARS_DIR)) 
	{
		if (oldFile.startsWith(username + '.') && oldFile !== filename) 
		{
			fs.unlinkSync(path.join(AVATARS_DIR, oldFile)) // this 
		}
	}
	await pipeline(data.file, fs.createWriteStream(filePath))//this is where the file is written. data.file is a readable stream, fs.createWriteStream(filePath) is a writable stream(destination)
	//pipeline connects them and waits until the whole file has been written.
	await prisma.user.update({
	  where: { id: user.id },
	  data: { avatarUrl: `/avatars/${filename}` },
	})
	return reply.send({ avatarUrl: `/avatars/${filename}` });
}
