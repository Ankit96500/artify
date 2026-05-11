import e from 'express';
import { userAuth } from "../middleware/auth.js";
import {generateImage} from "../controllers/image-controller.js"

const routes = e.Router();


routes.post('/generate',userAuth,generateImage);

export default routes;

