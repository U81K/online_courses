const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.getUserProfile = async (req, res) => {
	// const token = req.headers.authorization.split(" ")[1];
	// const user = req.user;
	// console.log(user);
	try{
		// console.log(req.user.id);
		const user = await User.findById(req.user.id);
		if (!user) return res.status(404).json({message: "user not found"});
		// console.log(user.id);
		res.status(200).json({
				id: user.id,
				username: user.username,
				email: user.email,
				role: user.role
			}
		)
	} catch(error){
		res.status(500).json({
			message: "server error",
			error: error.message
		})
	}
};