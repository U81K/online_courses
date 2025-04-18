const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateTokens = (userId) =>{
	const accessToken = jwt.sign(
		{id: userId},
		process.env.JWT_ACCESS_SECRET,
		{expiresIn: '15m'}
	);

	const refreshToken = jwt.sign(
		{id: userId},
		process.env.JWT_REFRESH_SECRET,
		{expiresIn: '7d'}
	);

	return {accessToken, refreshToken};
}

exports.signup = async (req, res) => {
	const {username, email, password, role} = req.body;
	if (!username || !email || !password){
		return (res.status(400).json({message: "Username, email, and password are required."}));
	}

	if (role && !['student', 'instructor'].includes(role)) {
		return res.status(400).json({ message: "role must be 'student' or 'instructor'." });
	}
	try{
		const emailExists = await User.findOne({email});
		if (emailExists) return res.status(400).json({message: "email already in use"})
		const usernameExists = await User.findOne({username});
		if (usernameExists) return res.status(400).json({message: "username already taken"});
		// hashing the password
		const hashedPassword = await bcrypt.hash(password, 10);
		// creating the user
		const user = await User.create({
			username, email,
			password: hashedPassword,
			role: role || 'student'
		});
		
		const {accessToken, refreshToken} = generateTokens(user.id);

		// string the refreshToken in the user doc
		user.refreshToken = refreshToken;
		await user.save();

		//send token to the client
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000
		});
		// const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "1h"})
		res.status(200).json({
			user: {
				id: user.id,
				username: user.username,
				role: user.role
			},
			accessToken
		});
	} catch (error) {
		res.status(500).json({message: "signup failed", error: error.message})
	}
};

exports.login = async (req, res) => {
	const {email, password} = req.body;
	if (!email || !password) return res.status(400).json({message: "email, password are required"});
	try {
		// get the user
		const user = await User.findOne({email});
		if (!user) return res.status(400).json({message: "invalid credentials"});

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({message: "invalid credentials"});

		const {accessToken, refreshToken} = generateTokens(user.id);

		user.refreshToken = refreshToken;
		await user.save();

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000
		});


		// const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "1h"});

		res.status(200).json({
			user:{
				id: user.id,
				username: user.username
			},
			accessToken
		});
	} catch (error){
		res.status(500).json({message: "login failed", error: error.message});
	}
};

exports.refreshToken = async (req, res) => {
	try{
		// get the ref token form cookies
		const refreshToken = req.cookies.refreshToken;
		if (!refreshToken) return res.status(401).json({message:  "Refresh token not found"});

		// get the user with this ref token
		const user = await User.findOne({refreshToken})
		if (!user) return res.status(403).json({message: "Invalid refresh token"});

		// verify the ref token
		try{
			const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
			if (decoded.id !== user.id) {
				return res.status(403).json({message: "Token mismatch" });
			}

			// get new tokens
			const {accessToken, refreshToken: newRefToken} = generateTokens(user.id);

			// update ref token in database
			user.refreshToken= newRefToken;
			await user.save();

			// set new refToken in cookie
			res.cookie('refreshToken', newRefToken, {
				httpOnly: true,
				secure: 'production',
				sameSite: 'strict',
				maxAge: 7 * 24 * 60 * 60 * 1000
			});
	
			return res.status(200).json({accessToken});
		}catch(error){
			return res.status(403).json({ message: "Invalid or expired refresh token" });
		}
	}catch(error){
		res.status(403).json({ message: "Refresh token failed", error: error.message });
	}
}

exports.logout = async (req, res) => {
	try {
		//getting the refresh token from cookies
		const refreshToken = req.cookies.refreshToken;

		if (refreshToken){
			// find user with this refreshToken
			const user = await User.findOne({refreshToken});
			if (user){
				user.refreshToken = null;
				await user.save();
			}
		}
		// Clear the refresh token cookie
		res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: 'production',
            sameSite: 'strict'
        });

		// Token is deleted on the client side
		res.status(200).json({message: "logout successful"});
	} catch(error){
		res.status(500).json({ message: "Logout failed", error: error.message });
	}
}; 