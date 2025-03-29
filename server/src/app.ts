import express from "express";
import cors from "cors";
import apiRoutes from './routes/api.routes';
import authRouter from "./routes/auth.routes";
import restaurantRouter from "./routes/restaurant.routes";
import menuRouter from "./routes/menu.routes";
import connect from "./models/index";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

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

connect;

app.use('/api', apiRoutes);
app.use('/auth', authRouter);
app.use('/restaurant', restaurantRouter);
app.use('/menu', menuRouter);

export default app;