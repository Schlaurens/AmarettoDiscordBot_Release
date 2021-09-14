const mongoose = require('mongoose');

const roast_schema = new mongoose.Schema({
    roast: {type: String, require: true}
})

const model = mongoose.model('RoastModels', roast_schema);

module.exports = model;