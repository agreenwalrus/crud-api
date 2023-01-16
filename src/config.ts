import dotenv from 'dotenv';
import { DEFAULT_PORT } from './utils/constats.js';

dotenv.config();
export const PORT = Number(process.env.PORT) || DEFAULT_PORT;
