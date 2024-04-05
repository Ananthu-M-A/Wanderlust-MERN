import express from 'express';
import verifyToken from '../middlewares/user.auth.middleware';
import { startChat } from '../controllers/chat.controller';

const liveChatRouter = express.Router();

liveChatRouter.get('/', verifyToken, startChat);

export default liveChatRouter;