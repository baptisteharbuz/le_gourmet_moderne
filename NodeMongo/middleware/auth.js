const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("Authorization header:", authHeader);
    if (!authHeader) {
        return res.status(401).json({ message: "Token is required" });
    }

    // Extraction du token en retirant le préfixe "Bearer " s'il est présent
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader;

    try {
        const verified = jwt.verify(token, process.env.SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = authenticate;