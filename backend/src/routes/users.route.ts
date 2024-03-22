import express from 'express';
import { blockUser, loadUsers, unblockUser } from '../controllers/users.controller';
import verifyAdminToken from '../middleware/adminAuth';
const usersRouter = express.Router();

usersRouter.get('/', verifyAdminToken, loadUsers);
usersRouter.put('/:userId/block', verifyAdminToken, blockUser);
usersRouter.put('/:userId/unblock', verifyAdminToken, unblockUser);

export default usersRouter;
