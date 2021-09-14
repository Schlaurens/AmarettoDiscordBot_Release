module.exports = {
    name: 'help',
    description: 'list of all the commands (richEmbed)',
    execute(message, Discord, colors, client, timeStamp, fs){

        //Parse config.json
        var data = fs.readFileSync('./config.json');
        var config = JSON.parse(data);

        const sEmbed = new Discord.MessageEmbed()
        .setColor(colors.blue_dark)
        .setTitle("Commands: ")
        .addField(`${config["prefix"]}help`, "Schickt dir eine Liste mit allen Commands.")
        .addField(`${config["prefix"]}ping`, "Pings the Bot")
        .addField(`${config["prefix"]}hushhush [@User]`, `Moved den User durch mehrere Channel.`)
        .addField(`${config["prefix"]}roast [Name]`, "Roastet den User in eine sehr intensive und traurige Depression.")
        .addField(`${config["prefix"]}roast --file`, "Gibt die JSON Datei aus, welche alle Roast beinhaltet.")
        .addField(`${config["prefix"]}roast --add [Text]`, "Fügt einen neuen Roast hinzu. Hierbei ist '$name$' der Platzhalter für den Namen des geroasteten.")
        .addField(`${config["prefix"]}roast --remove [Index]`, "Entfernt den Roast an dem gegebenen Index.")
        .addField(`${config["prefix"]}roast --upload [Datei]`, "Lädt die JSON Datei im Anhang hoch und ersetzt die alte roasts.json mit dieser.")
        .addField(`${config["prefix"]}picture [Index]`, "Postet krasse Bilder vom Squad.")
        .addField(`${config["prefix"]}picture [Name]|[RegEx]`, "Postet krasse Bilder vom Squad.")
        .addField(`${config["prefix"]}picture --list`, "Listet alle Bilder indexiert auf.")
        .addField(`${config["prefix"]}picture --number`, "Zeigt die genaue Anzahl der Bilder an, die man mit **/picture** ansehen kann.")
        .addField(`${config["prefix"]}picture --remove [Index]`, "Entfernt das Bild an dem gegebenen Index.")
        .addField(`${config["prefix"]}picture --index [Name]`, "Gibt den Index des gesuchten Bildes zurück.")
        .addField(`${config["prefix"]}picture --upload [Datei]`, "Lädt die JSON Datei im Anhang hoch und ersetzt die alte pictures.json mit dieser.")
        .addField(`${config["prefix"]}userinfo [@User]`, "Zeigt Informationen über den bestimmten User an.")
        .addField(`${config["prefix"]}serverinfo`, "Zeigt Informationen über den Server an.")
        .addField(`${config["prefix"]}clear [Anzahl]`, "Löscht die gegebene Anzahl der Nachrichten in dem Channel.")
        .addField(`${config["prefix"]}save [URL] [Bildname]`, "Speichert das Bild aus der **URL** ab, sodass man es mit **/picture** sehen kann.")
        .addField(`${config["prefix"]}roll [Größe des Würfels]`, "Rollt einen Würfel mit einer gegebenen Größe. Wird keine Größe angegeben, ist die Größe 6.")
        .addField(`${config["prefix"]}smart`, "Postet ein Bild von dem schlausten Wissenschaftler, der je existierte.")
        .addField(`${config["prefix"]}haltStop [@User]`, "Speichert die Rollen des gegebenen Users im JSON Format ab.")
        .addField(`${config["prefix"]}haltStop --file`, "Gibt das JSON Backup als Datei aus.")
        .addField(`${config["prefix"]}haltStop --members`, "Gibt eine Liste der User aus, die bereits im Backup vermerkt sind.")
        .addField(`${config["prefix"]}haltStop --clear`, "Löscht das Backup.")
        .addField(`${config["prefix"]}haltStop --upload [Datei]`, "Lädt die JSON Datei im Anhang hoch und ersetzt die alte roleBackup.json mit dieser.")
        .addField(`${config["prefix"]}reassignRoles [@User]`, "Stellt alle Rollen aus dem Backup für einen gegebenen User wieder her.")
        .setFooter(`Amaretto | Seine Majestät und Anführer dieses Servers.`, client.user.displayAvatarURL());
        
        message.author.send({embed: sEmbed});

        console.log(`${timeStamp.getTimeStamp()} ${message.author.username} requested help`);
    }
}