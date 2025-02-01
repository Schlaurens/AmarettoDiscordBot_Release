import mongoose from 'mongoose';

export interface Picture_Interface {
    name: string;
    url: string;
}

const picture_schema = new mongoose.Schema<Picture_Interface>({
    name: {type: String, require: true, unique: true},
    url: {type: String, require: true, unique: true}
})

const model_picture = mongoose.model('PictureModels', picture_schema);

module.exports = model_picture;