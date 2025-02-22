import jwt from 'jsonwebtoken';
import redisClient from '../services/redis.service.js';
export const authUser = async (req, res, next) => {
    try {
        // Get the token from request headers
        const token =req.cookies.token || req.headers.authorization.split(' ')[1];

        if (!token ) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
        const isBlacklisted=await redisClient.get(token);
        if(isBlacklisted){
            res.cookie('token','');
            return res.status(401).send({error:'Unautorized user'})
        }
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data to request object
        req.user = decoded;

        // Proceed to the next middleware/controller
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};
