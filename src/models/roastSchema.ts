import mongoose from 'mongoose';

export interface Roast_Interface {
    roast: string;
}

const roast_schema = new mongoose.Schema<Roast_Interface>({
    roast: {type: String, require: true}
})

const model_roast = mongoose.model('RoastModels', roast_schema);

module.exports = model_roast;