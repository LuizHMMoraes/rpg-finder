const RpgGroup = require('../models/rpgGroup');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const rpgGroups = await RpgGroup.find({});
    res.render('rpgGroups/index', { rpgGroups })
}

module.exports.renderNewForm = (req, res) => {
    res.render('rpgGroups/new')
}

module.exports.createRpgGroup = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.rpgGroup.location,
        limit:1
    }).send();
    const rpgGroup = new RpgGroup(req.body.rpgGroup);
    rpgGroup.geometry = geoData.body.features[0].geometry;
    rpgGroup.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    rpgGroup.author = req.user._id;
    await rpgGroup.save();
    console.log(rpgGroup);
    req.flash('success', 'Succefully made a new RPG Group!');
    res.redirect(`/rpgGroups/${rpgGroup._id}`);
}

module.exports.showRpgGroup = async (req, res) => {
    const rpgGroup = await RpgGroup.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!rpgGroup) {
        req.flash('error', 'Cannot find that RPG Group!');
        return res.redirect('/rpgGroups');
    }
    res.render('rpgGroups/show', { rpgGroup });
}

module.exports.renderEditRpgGroup = async (req, res) => {
    const rpgGroup = await RpgGroup.findById(req.params.id);
    if (!rpgGroup) {
        req.flash('error', 'Cannot find that RPG Group!');
        return res.redirect('/rpgGroups');
    }
    res.render('rpgGroups/edit', { rpgGroup });
}

module.exports.updateRpgGroup = async (req, res) => {
    const { id } = req.params;
    const rpgGroup = await RpgGroup.findByIdAndUpdate(id, { ...req.body.rpgGroup });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    rpgGroup.images.push(...imgs)
    await rpgGroup.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await rpgGroup.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Succefully updated RPG Group!');
    res.redirect(`/rpgGroups/${rpgGroup._id}`);
}

module.exports.deleteRpgGroup = async (req, res) => {
    const { id } = req.params;
    const rpgGroup = await RpgGroup.findByIdAndDelete(id);
    req.flash('success', 'Succefully deleted RPG Group!');
    res.redirect('/rpgGroups');
}