const RpgGroup = require('../models/rpgGroup');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const rpgGroup = await RpgGroup.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    rpgGroup.reviews.push(review);
    await review.save();
    await rpgGroup.save();
    req.flash('success', 'Succefully made a new review!');
    res.redirect(`/rpgGroups/${rpgGroup._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await RpgGroup.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Succefully deleted review!');
    res.redirect(`/rpgGroups/${id}`);
}