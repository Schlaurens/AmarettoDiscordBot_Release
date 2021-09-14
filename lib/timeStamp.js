module.exports = {
    
    /**
     * Generates the current timestamp.
     * @returns the current timestamp. Format: dd.MM.yyyy hh:mm:ss
     */
    getTimeStamp: function() {
        var currentDate = new Date();
        var date = currentDate.getDate();
        var month = currentDate.getMonth() + 1; //January = 0
        var year = currentDate.getFullYear();
        var hours = currentDate.getHours();
        var minutes = currentDate.getMinutes();
        var seconds = currentDate.getSeconds();

        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;

        var dateString = date + "-" + month + "-" + year + " "; 
        var timeString = hours + ":" + minutes + ":" + seconds;
        var timeStamp = dateString +  timeString;
        
        return timeStamp;
    }
}