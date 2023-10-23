import { 
    GuildMember 
} from "discord.js";

module.exports = {

    /**
     * Checks whether a given GuildMember has the roles from the permission_handle.
     * @param {*} permission_handle contains the roles that are needed for the corresponding command.
     * @param {*} member the GuildMember whose permissions to check
     * @returns true if the given member has the needed permissions or there is no permission_handle.
     */
    check_permissions: function(permission_handle: string, member: GuildMember) {
        
        //Parse config.json
        const fs = require('fs');
        var data = fs.readFileSync('./config.json');
        var config = JSON.parse(data);

        if(!member) return false;

        //==== Permission Handler ====
        if (config["commandPermissions"][permission_handle] && config["commandPermissions"][permission_handle].length) {
            for (var index in config["commandPermissions"][permission_handle]) {

                //Member has permission
                if(member.roles.cache.find(role => role.id === config["commandPermissions"][permission_handle][index]["roleId"])) {
                    return true;
                }
                
                if(parseInt(index, 10) === config["commandPermissions"][permission_handle].length-1) {
                    return false;
                }
            }
        }
        return true;
    }
}