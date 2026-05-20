import 'reflect-metadata';
import dotenv from 'dotenv';
import { Server } from './server';

dotenv.config();

(async() => {
  const server = new Server();
  await server.start();
})();
