



$("#search-button").on("click", function () {
    
    var searchTitle = "";
    var city = "";
    var apiKey = "fN2JT7PZlbQ8jAFoGeun4pAKP8Rg8y5z";
    var qs = "https://app.ticketmaster.com/discovery/v2/events?" 
    + "apikey =" + apiKey + "&countryCode=US";

    $.ajax({
        url: qs,
        method: "GET"
    }).then(
        
    );
});