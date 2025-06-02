const Course = require('../models/courseModel');
const User = require('../models/User');
const mongoose = require('mongoose')

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourseById = async(req, res) =>{
	try{
		const {courseId} = req.params;
		
		if (!mongoose.Types.ObjectId.isValid(courseId)) {
			return res.status(400).json({ message: 'Invalid course ID format' });
		}

		const course = await Course.findById(courseId);

		if (!course){
			return (res.status(404).json({message:'Course not found'}));
		}

		res.status(200).json(course);
	}catch (error){
		console.error('Error fetching course:', error);
		res.status(500).json({ 
		  message: 'Error fetching course', 
		  error: error.message 
		});
	}
};

exports.createCourse = async (req, res) => {
  try {
    // Extract token data
    const token = req.headers.authorization?.split(' ')[1];
    let instructorId;
    let user;

    if (token) {
		// Get the user ID from the JWT token
		const jwt = require('jsonwebtoken');
		// console.log(token);
		// const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
		// console.log("test");
      instructorId = decoded.id;
      
      // Check if user is an instructor
      user = await User.findById(instructorId);
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
      instructor_id: instructorId,
	  instructor_username: user.username,
    };

    const course = new Course(courseData);
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
