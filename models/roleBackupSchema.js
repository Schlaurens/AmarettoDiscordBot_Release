const mongoose = require('mongoose');

const role_backup_schema = new mongoose.Schema({
    name: {type: String, required: true},
    user_id: {type: String, required: true, unique: true},
    timestamp: {type: String, required: true},
    roles : [{
        guild : {type: String, required: true},
        id : {type: String, required: true},
        name: {type: String, required: true},
        color: {type: Number, required: true},
        hoist: {type: Boolean, required: true},
        rawPosition: {type: Number, required: true},
        managed: {type: Boolean, required: true},
        mentionable: {type: Boolean, required: true},
        deleted: {type: Boolean, required: true},
    }]
})

const model = mongoose.model('RoleBackupModels', role_backup_schema);

module.exports = model;