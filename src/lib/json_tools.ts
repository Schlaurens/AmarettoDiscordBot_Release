import {
    Message
} from "discord.js";

module.exports = {

    download_json: function (message: Message, url: string, callback: any) {

        const https = require('https');

        if (!url) {
            message.channel.send("Brauche eine gültige JSON Datei.")
            return;
        }
        let req = https.get(url, function (res: any) {
            let data = '',
                json_data;

            res.on('data', function (stream: any) {
                data += stream;
            });
            res.on('end', function () {
                json_data = JSON.parse(data);
                // will output a Javascript object
                callback(json_data);
            });
        });

        req.on('error', function (e: any) {
            console.log(e.message);
        });
    },

    async validate_json(schema: any, data: any, callback: any) {

        const Ajv = require("ajv").default
        const ajv = new Ajv({
            allErrors: true,
            strict: false
        })
        const validate = await ajv.compile(schema)
        const valid = validate(data)
        if (!valid) console.log("Error! JSON has invalid structure.", validate.errors)

        callback(valid);
    }
}