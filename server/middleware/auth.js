import User from "../models/user-model.js";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";


export const userAuth = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(404).json({ success: false, msg: "Token not found in header" })
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (tokenDecode.id) {
            if (req.method === 'GET') {
                req.userId = tokenDecode.id
            } else {

                req.body.userId = tokenDecode.id;
            }
            next();
        } else {
            return res.status(404).json({ success: false, msg: "Token id not found" })
        }

    } catch (error) {
        console.log("error - > > ", error);
        res.status(404).json({ success: false, msg: "Token not found" })
    }

}

