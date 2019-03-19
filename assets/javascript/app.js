// var location = new google.maps.LatLng(50.0875726, 14.4189987); // declare location in map
var lat = 39.6766;
var lng = -104.9619;
var res;

//Load Map using user location
function initMap() {


    // var location = new google.maps.LatLng(50.0875726, 14.4189987); // declare location in map
    var location = new google.maps.LatLng(lat, lng); // declare location in map


    var mapCanvas = document.getElementById('map'); // where to place the map in the view
    var mapOptions = { // basic options for the map
        center: location,
        zoom: 12,
        panControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(mapCanvas, mapOptions); // create a new object and pass configurations from above

    //Loop through events to drop pin on each latitude
    for (var i = 0; i < res._embedded.events.length; i++) {
        console.log("made it");

        //Create new markers for each event
        marker = new google.maps.Marker({
            position: {
                lat: parseFloat(res._embedded.events[i]._embedded.venues[0].location.latitude),
                lng: parseFloat(res._embedded.events[i]._embedded.venues[0].location.longitude)
            },
            //Display event name on hover
            title: res._embedded.events[i].name,
            map: map,
        });
    }

}

var city = "";
var apiKey = "fN2JT7PZlbQ8jAFoGeun4pAKP8Rg8y5z";
var qs = "";
var listOfEvents = [];

$("#search_button").on("click", function (event) {

    // clear any events from previous searches
    clearEventList();

    // Grab user location
    var userLocation = $("#searchCity").val();
    console.log(userLocation);

    // get the results from the search
    var searchTitle = $("#searchKeyword").val();
    event.preventDefault();
    city = $("#searchCity").val();
    apiKey = "fN2JT7PZlbQ8jAFoGeun4pAKP8Rg8y5z";
    qs = "https://app.ticketmaster.com//discovery/v2/events?apikey="
        + apiKey
        + "&city=" + city
        + "&keyword=" + searchTitle
        + "&countryCode=US";

    $.ajax({
        url: qs,
        method: "GET"
    }).then(function (response) {
        // response
        console.log(response);
        res = response;
        // Take user input to find lattitude and longitude and re-load map with given lat-long
        lat = response._embedded.events[0]._embedded.venues[0].location.latitude;
        lng = response._embedded.events[0]._embedded.venues[0].location.longitude;
        //Reload map
        initMap();

        try {
            // store each event that comes back from the list
            response._embedded.events.forEach(function (_event) {

                listOfEvents.push(_event);
            })
        }
        catch (e) {
            alert("_embedded undefined");
        }

        // create the links to the events
        createEventLinks();
    }


    );
});

function clearEventList() {

    // clear the list of events
    while (listOfEvents.length !== 0) {
        listOfEvents.pop();
    }

    // update the html
    $("#event-links").empty();

}

$("#disp-link-location").on("click", function () {

    // add/update the location of the event on the map
});

// create an event
// parameters:  title of event
//              description
//              location-latitude
//              location-longitude
//              url to purchase tickets
function createEventLinks() {

    // create a row witth some columns
    // <div class="row">
    //             <div class="pricing-column col-md-4">
    //                 <div class="card">
    //                     <div class="card-header">
    //                         <h3>Event Number 1</h3>
    //                     </div>

    //                     <div class="card-body">
    //                         <h2>location of event</h2>
    //                         <p>Short description</p>
    //                         <button type="button" class="btn btn-lg btn-block btn-outline-dark">Buy</button>
    //                     </div>
    //                 </div>
    //             </div>


    // make sure to clear any old events from previous searches
    //clearEventList();

    // create the links to the events
    var rowNum = 0;
    for (var i = 0; i < listOfEvents.length; ++i) {


        var newCol = $("<div class='pricing-column col-md-4'></div>");
        var newCard = $("<div class='card'></div>");
        var newCardHeader = $("<div class='card-header'></div>");
        var eventTitle = "";
        var eventCity = "";
        var desc = "";
        var linkToTickets = "";
        try {
            eventTitle = $("<h3>").text(listOfEvents[i].name);
        }
        catch (e) {
            eventTitle = "error: name not found";
        }
        var newCardBody = $("<div class='card-body'></div>");
        try {
            eventCity = $("<h2>").text(listOfEvents[i]._embedded.venues[0].city.name);
        }
        catch (e) {
            eventCity = "city not found";
        }

        try {
            desc = $("<p>").text(listOfEvents[i].promoter.description);
        }
        catch (e) {
            desc = "description not found";
        }

        try {
            linkToTickets = $("<button id='disp-link-loc'class='btn btn-lg btn-block btn-outline-dark'>Buy</button>");
        }
        catch (e) {
            linkToTickets = "url not found";
        }


        newCardHeader.append(eventTitle);
        newCard.append(newCardHeader);

        newCardBody.append(eventCity);
        newCardBody.append(desc);
        newCardBody.append(linkToTickets);
        newCard.append(newCardBody);

        newCol.append(newCard);


        // if i % 3 === 0 then there is a multiple of 3 in the current row
        //  so we need to create a new row
        if (i === 0) {
            var newRow = $("<div class='row r" + rowNum + "'></div>");
            newRow.append(newCol);
            $("#event-links").append(newRow);

        }
        else if (i % 3 === 0) {
            // create a new row
            var newRow = $("<div class='row r" + rowNum + "'></div>");
            newRow.append(newCol);
            $("#event-links").append(newRow);
            ++rowNum;

        }
        else {
            var temp = ".r" + rowNum;
            $(temp).append(newCol);
        }
    }

}