import mongoose from 'mongoose';

const roast_schema = new mongoose.Schema({
    roast: {type: String, require: true}
})

const model_roast = mongoose.model('RoastModels', roast_schema);

module.exports = model_roast;