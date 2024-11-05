import jwt from 'jsonwebtoken';
const { verify } = jwt;
const authorizationRequired = "Authorization Required";
const invalidCredentials = "Invalid Credentials";

const auth = (req, res, next) => {
    if (!req.headers.authorization) {
        res.statusMessage = authorizationRequired;
        return res.status(401).json({message: authorizationRequired});
    }
    
    try {
        const token = req.headers.authorization.split(' ')[1]; // Get token part after 'Bearer '
        verify(token, process.env.JWT_SECRET_KEY);
        next();
    } catch (error) {
        res.statusMessage = invalidCredentials;
        return res.status(403).json({message: invalidCredentials});
    }
}

export { auth };