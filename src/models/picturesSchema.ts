import mongoose from 'mongoose';

const picture_schema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    url: {type: String, require: true, unique: true}
})

const model_picture = mongoose.model('PictureModels', picture_schema);

module.exports = model_picture;