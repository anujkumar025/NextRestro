import { Router } from 'express';
import { getHome } from '../controllers/home.controller';
import { authenticate } from '../middlewares/auth.middlewares';
import upload from '../middlewares/multer.config';

const apiRoutes = Router();

interface UserPayload {
    id: string;
    role: string;
    username: string;
}

declare module "express" {
    interface Request {
        user?: UserPayload;
    }
}

apiRoutes.get("/", getHome);

export default apiRoutes;