const express = require('express');
const router = express.Router();
const rpgGroups = require('../controllers/rpgGroups');
const catchAsync = require('../utility/catchAsync');
const { isLoggedIn, isAuthor, validateRpgGroup } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(rpgGroups.index))
    .post(isLoggedIn, upload.array('image'), validateRpgGroup, catchAsync(rpgGroups.createRpgGroup));

router.get('/new', isLoggedIn, rpgGroups.renderNewForm);

router.route('/:id')
    .get(catchAsync(rpgGroups.showRpgGroup))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateRpgGroup, catchAsync(rpgGroups.updateRpgGroup))
    .delete(isLoggedIn, isAuthor, catchAsync(rpgGroups.deleteRpgGroup));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(rpgGroups.renderEditRpgGroup));

module.exports = router;