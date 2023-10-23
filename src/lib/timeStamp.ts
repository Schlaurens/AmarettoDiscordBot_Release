module.exports = {
    
    /**
     * Generates the current timestamp.
     * @returns the current timestamp. Format: dd.MM.yyyy hh:mm:ss
     */
    getTimeStamp: function() {
        var currentDate = new Date();
        var date: number = currentDate.getDate();
        var month: number = currentDate.getMonth() + 1; //January = 0
        var year: number = currentDate.getFullYear();
        var hours: number = currentDate.getHours();
        var minutes: number = currentDate.getMinutes();
        var seconds: number = currentDate.getSeconds();

        var dateString: string = date.toString() ;
        var monthString: string = month.toString();
        var hoursString: string = hours.toString();
        var minutesString: string = minutes.toString(); 
        var secondsString: string = seconds.toString();

        if(month < 10) monthString = "0" + month.toString();
        if(date < 10) dateString = "0" + date.toString();
        if(hours < 10) hoursString = "0" + hours.toString();
        if(minutes < 10) minutesString = "0" + minutes.toString();
        if(seconds < 10) secondsString = "0" + seconds.toString();

        var dateCombination: string = dateString + "-" + monthString + "-" + year.toString() + " "; 
        var timeCombination: string = hoursString + ":" + minutesString + ":" + secondsString;
        var timeStamp: string = dateCombination +  timeCombination;
        
        return timeStamp;
    }
}