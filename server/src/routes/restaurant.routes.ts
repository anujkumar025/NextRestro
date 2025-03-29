import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middlewares';
import upload from '../middlewares/multer.config';
import { handleRestroUpdate, handleRestroInfo } from '../controllers/restaurant.controller';

const restaurantRouter = Router();

restaurantRouter.put("/update", authenticate, upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "bannerPicture", maxCount: 1 },
]), handleRestroUpdate);                                                           // to update restaurant info
// restaurantRouter.get("/", authenticate);             // to get info of restaurant
restaurantRouter.get("/:id", handleRestroInfo);                  // to get info of restaurant


export default restaurantRouter;