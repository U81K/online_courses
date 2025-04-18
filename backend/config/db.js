const mongoose = require('mongoose');

const connectDb = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("mongodb connected");
	} catch (err) {
		console.error("failed to connect to mongodb", err);
		process.exit(1);
	}
}

module.exports = connectDb;