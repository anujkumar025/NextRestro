import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middlewares';
import upload from '../middlewares/multer.config';
import { handleAddItem, handleDeleteItem, handleModifyItem, handleGetMenu } from '../controllers/menu.controller';

const menuRouter = Router();

menuRouter.put("/additem", authenticate, upload.single("image"), handleAddItem);              // to add item in menu
menuRouter.put("/:id", authenticate, upload.single("image"), handleModifyItem);             // update info of an item in menu
menuRouter.delete("/:id", authenticate, handleDeleteItem);      // to delete an item from menu
menuRouter.get("/:id", handleGetMenu);  // to get menu of particular restaurant

export default menuRouter;
