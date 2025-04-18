const Course = require('../models/courseModel');
const User = require('../models/User');

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    // Extract token data
    const token = req.headers.authorization?.split(' ')[1];
    let instructorId;
    
    if (token) {
      // Get the user ID from the JWT token
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      instructorId = decoded.id;
      
      // Check if user is an instructor
      const user = await User.findById(instructorId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      if (user.role !== 'instructor') {
        return res.status(403).json({ 
          message: 'Access denied. Only instructors can create courses' 
        });
      }
    } else {
      return res.status(401).json({ 
        message: 'Authentication required to create courses' 
      });
    }

    const courseData = {
      ...req.body,
      instructor: instructorId
    };

    const course = new Course(courseData);
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
