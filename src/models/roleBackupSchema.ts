import mongoose from 'mongoose';

export interface RoleBackup_Interface {
    name: string;
    displayName: string;
    user_id: string;
    timestamp: string;
    roles: [
        {
            guild: string;
            id: string;
            name: string;
            color: number;
            hoist: boolean;
            rawPosition: number;
            managed: boolean;
            mentionable: boolean;
            tags: [
                {
                    botId: string;
                    integrationId: string;
                    premiumSubscriberRole: boolean;
                }
            ]
        }
    ];
}

const role_backup_schema = new mongoose.Schema<RoleBackup_Interface>({
    name: {type: String, required: true},
    displayName: {type: String, required: false},
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
        tags: [
            {
                botId: {type: String, required: false},
                integrationId: {type: String, required: false},
                premiumSubscriberRole: {type: Boolean, required: false}
        }]
    }]
})

const model_role_backup = mongoose.model('RoleBackupModels', role_backup_schema);

module.exports = model_role_backup;