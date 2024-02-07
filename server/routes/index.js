const express = require('express');
const router = express.Router();

const challengesRoutes = require('./challenges');
const commentsRoutes = require('./comments');
const solutionsRoutes = require('./solutions');
const usersRoutes = require('./users');

router.use('/challenges', challengesRoutes);
router.use('/comments', commentsRoutes);
router.use('/solutions', solutionsRoutes);
router.use('/users', usersRoutes);

module.exports = router;
