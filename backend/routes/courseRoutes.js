const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const protect = require('../middleware/authMiddleware')

//public routes
router.get('/', courseController.getCourses);
router.get('/:courseId', courseController.getCourseById);

//protected routes
router.post('/', protect, courseController.createCourse);


module.exports = router;
