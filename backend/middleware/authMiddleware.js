const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
	const authHeader = req.headers.authorization;
  
	if (!authHeader) {
		return res.status(401).json({ message: "Authorization denied. No token provided." });
	}
	
	const token = req.headers.authorization.split(" ")[1];
	if (!token) return res.status(401).json({message: "authorization denied"})
	try {
		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
		req.user = decoded;
		next();
	} catch(error){
		res.status(403).json({ message: "Invalid token" });
	}
};

module.exports = protect;