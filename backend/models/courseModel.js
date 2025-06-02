const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  instructor_username: {type: String, required: true},
  price: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
