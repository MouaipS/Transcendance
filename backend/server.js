import Fastify from 'fastify'

const fastify = Fastify({ logger: true });

fastify.get('/', async (request, reply) => {
	return {status: 'ok'};
});

fastify.listen({ port: 3001, host: '0.0.0.0' }, (err) =>{
	if (err) {
		fastify.log.error(err);
		// ProcessingInstruction.exit(1);
		ProcessingInstruction.exit(1);
	}
});
