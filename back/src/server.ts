import fastifyCors from '@fastify/cors';
import { userRoutes } from './routes/userRoutes';
import { postRoutes } from './routes/postRoutes';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import dotenv from 'dotenv';
import 'dotenv/config';
import { app } from './app';
import prisma from './prismaClient';

dotenv.config();

app.register(fastifyCors, {
  origin: '*',
});

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'Blog',
      description: 'Especificações da API para o back-end do blog.',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(userRoutes);
app.register(postRoutes, { prefix: '/posts' });

app.listen({ host: 'localhost', port: 3000 }, async (err, address) => {
  // await prisma.user.deleteMany();
  if (err) {
    // console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
