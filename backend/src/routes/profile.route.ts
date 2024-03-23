import express from 'express';
import verifyToken from '../middleware/user.auth.middleware';
import { loadProfile, updateProfile } from '../controllers/profile.controller';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const profileRouter = express.Router();

profileRouter.get('/', verifyToken, loadProfile);
profileRouter.put('/update', verifyToken, upload.single("imageFile"), updateProfile);

export default profileRouter;