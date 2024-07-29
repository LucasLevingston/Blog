import fastifyCors from '@fastify/cors';
import Fastify from 'fastify';
import { userRoutes } from './routes/userRoutes';
import { postRoutes } from './routes/postRoutes';

const app = Fastify({ logger: false });

app.register(fastifyCors, {
  origin: '*',
});

app.register(userRoutes, { prefix: '/user' });
app.register(postRoutes, { prefix: '/posts' });

app.listen({ host: 'localhost', port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
