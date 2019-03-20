$("document").ready(function () {
    $("#hide-on-load").hide();
    console.log("Load");
});

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

/********************************************************************************/
/*                                                                              */
/*      this is the app.js file                                                 */
/*                                                                              */
/*******************************************************************************/

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBLTkosSO3iupdRISkI3cYT8qtjbY5Ukrs",
    authDomain: "classproject-1db.firebaseapp.com",
    databaseURL: "https://classproject-1db.firebaseio.com",
    projectId: "classproject-1db",
    storageBucket: "classproject-1db.appspot.com",
    messagingSenderId: "90720089463"
};

firebase.initializeApp(config);

// create a handle to the database
var database = firebase.database();

// globals
var city = "";
var apiKey = "fN2JT7PZlbQ8jAFoGeun4pAKP8Rg8y5z";
var qs = "";
var listOfEvents = [];
var numBookmarks = 0;


/**************************************************************************/
/*      event:          search_button.click                               */
/*                                                                        */
/*      purpose:        respond to the search button being clicked        */
/**************************************************************************/
$("#search_button").on("click", function (event) {

      // prevent the form from submitting
    event.preventDefault();

    $("#hide-on-load").show();
    
    // clear any events from previous searches
    clearSearchResults();

    // get the results from the search
    var searchTitle = $("#searchKeyword").val();

  
    // gert the value from the city search field
    city = $("#searchCity").val();

    // store the api key to query the ticketmaster
    apiKey = "fN2JT7PZlbQ8jAFoGeun4pAKP8Rg8y5z";

    // url to link us to ticketmaster
    qs = "https://app.ticketmaster.com//discovery/v2/events?apikey="
        + apiKey
        + "&city=" + city
        + "&keyword=" + searchTitle
        + "&countryCode=US";


    // make a query request to ticketmaster for some information
    $.ajax({
        url: qs,
        method: "GET"
    }).then(function (response) {
        // MAP FUNCTIONALITY (change map coords)
        res = response;
        // Take user input to find lattitude and longitude and re-load map with given lat-long
        lat = response._embedded.events[0]._embedded.venues[0].location.latitude;
        lng = response._embedded.events[0]._embedded.venues[0].location.longitude;
        //reload map√
        initMap();

        // try this block of code 
        try {
            // store each event that comes back from the list
            response._embedded.events.forEach(function (_event) {
                listOfEvents.push(_event);
            })
        }
        catch (e) {
            // if we are here something failed in the try block
            alert("Unable to find an event. Update your search criteria.");

        }

        // create the links to the events
        createEventLinks();
        console.log(listOfEvents);
    });
    
});

/**************************************************************************/
/*      function:       clearSearchResults                                */
/*                                                                        */
/*      purpose:        to clear the events from the search list          */
/*                                                                        */
/*      parameters:     none                                              */
/*                                                                        */
/*      return:         none                                              */
/**************************************************************************/
function clearSearchResults() {

    // clear the list of events
    while (listOfEvents.length !== 0) {
        listOfEvents.pop();
    }
    // update the html
    $("#event-links").empty();
}

/**************************************************************************/
/*      function:       addEventToBookmarks                               */
/*                                                                        */
/*      purpose:        add the event to the list of bookmarks            */
/*                                                                        */
/*      parameters:     none                                              */
/*                                                                        */
/*      return:         none                                              */
/**************************************************************************/
function addEventToBookmarks(_name, _city, _locLat, _locLong, _url, _desc, _date) {

    if (firebase.auth().currentUser !== null) {
        database.ref("Users/user" + firebase.auth().currentUser.uid).push({
            name: _name,
            city: _city,
            locLatitude: _locLat,
            locLongitude: _locLong,
            url: _url,
            desc: _desc,
            date: _date
        });
    }
    else {
   

        database.ref("general-bookmarks").push({
            name: _name,
            city: _city,
            locLatitude: _locLat,
            locLongitude: _locLong,
            url: _url,
            desc: _desc,
            date: _date
        });
    }
}

/**************************************************************************/
/*      function:       createEventLinks                                  */
/*                                                                        */
/*      purpose:        To create an event and add that event as a        */
/*                      link to the page.                                 */
/*                                                                        */
/*      parameters:     none                                              */
/*                                                                        */
/*      return:         none                                              */
/**************************************************************************/
function createEventLinks() {

    var rowNum = 0;
    for (var i = 0; i < listOfEvents.length; ++i) {

        var newCol = $("<div class='pricing-column col-md-4'></div>");
        var newCard = $("<div class='card'></div>");
        var newCardHeader = $("<div class='card-header'></div>");
        var eventTitle = "";
        var eventCity = "";
        var desc = "";
        var linkToBuyTickets = "";
        var linkToSavedTickets = "";
        var eventDate = "";

 
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
            eventDate = $("<h5>").text(listOfEvents[i].dates.start.localDate);
        }
        catch (e) {
            eventDate = "date not found";
        }
        try {
            desc = $("<p>").text(listOfEvents[i].promoter.description);
        }
        catch (e) {
            desc = "description not found";
            $("<p>").hide(desc="");
        }


        linkToBuyTickets = $("<button id='disp-link-loc' btnid='" + i + "' class= 'btn btn-sm btn-block btn-outline-dark'>Buy</button>");
        linkToSavedTickets = $("<button id='disp-save-loc'  btnid='" + i + "' class= 'btn btn-sm btn-block btn-outline-dark'>Save</button>");

         // click event for the event
         linkToBuyTickets.on("click", function () {

            // TODO: have this take the user to buy tickets
            // this is the value representing which event this button is linked to in the
            var indexOfEvent = parseInt( $(this).attr("btnid"));
            location.href = listOfEvents[indexOfEvent].url;

         });

        // click event for the event
        linkToSavedTickets.on("click", function () {

            var index =  parseInt( $(this).attr("btnid"));

            var decription = "";
            var city = "";
            var title = "";
            var date = "";

            try {
                decription = listOfEvents[index].promoter.description;
            }
            catch (e) {
                decription = desc;
            }
            try {
                city = listOfEvents[index]._embedded.venues[0].city.name;
            }
            catch (e) {
                city = eventCity;
            }
            try {
                date = listOfEvents[index].dates.start.localDate;
            }
            catch (e) {
                date = eventDate;
            }
            try {
                title = listOfEvents[index].name;
            }
            catch (e) {
                title = eventTitle;
            }

            // store the info into the database
            addEventToBookmarks(title, city, 0, 0, listOfEvents[index].url, decription, date);

        });

        newCardHeader.append(eventTitle);
        newCard.append(newCardHeader);
        newCardBody.append(eventCity);
        newCardBody.append(eventDate);
        newCardBody.append(desc);
        newCardBody.append(linkToSavedTickets);
        newCardBody.append(linkToBuyTickets);
        newCard.append(newCardBody);
        newCol.append(newCard);

        // if i % 3 === 0 then there is a multiple of 3 in the current row
        //  so we need to create a new row
        if (i === 0) {
            var newRow = $("<div class='row r" + rowNum + "'></div>");
            newRow.append(newCol);
            $("#event-links").append(newRow);

        }
        else if ((i % 3) === 0) {
            // create a new row
            ++rowNum;
            var newRow = $("<div class='row r" + rowNum + "'></div>");
            newRow.append(newCol);
            $("#event-links").append(newRow);
        }
        else {
            var temp = ".r" + rowNum;
            $(temp).append(newCol);
        }
    }

}

var email = "";
var pass = "";
var btnSignUp = $("#confirmSignUp");
var btnLogIn = $("#alreadyAMember");
var btnLogOut = $("#log_out");

// Login event -- pass user email and password
$(btnLogIn).on("click", function (e) {  // returns promises
    e.preventDefault();
    email = $("#email").val().trim();
    pass = $("#password").val().trim();
   
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(function (error) {
        console.log(error.code);
    });

});


// create a new account, passing user's email and password input
// user is automatically logged in
$(btnSignUp).on("click", function(e) {
    e.preventDefault();
    email = $("#email").val().trim();
    pass = $("#password").val().trim();
    firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {

        console.log(error.code);
    });
});

// signs user out
$(btnLogOut).on("click", function() {
    firebase.auth().signOut().then(function() {
        console.log("successfully signed out")
    }).catch(function(error) {
        console.log(error.code);
    });
});

$("#pop").on("click", function () {
    alert("user id: " + firebase.auth().currentUser);
});

$("#pip").on("click", function () {
    firebase.auth().signOut().then(function() {
        console.log("successfully signed out")
    }).catch(function(error) {
        console.log(error.code);
    });
});

// auth listener
firebase.auth().onAuthStateChanged(function(firebaseUser) { // based on whether or not user is logged in
    if (firebaseUser) {
        
        alert("user has signed in, id is: " + firebaseUser.uid);
        // var displayEmail = firebaseUser.email;
        // var emailVerified = firebaseUser.emailVerified;
        var userId = firebaseUser.uid;
        console.log("user id: " + userId);
        console.log("firebaseuser object: " + firebaseUser);
        btnLogOut.removeClass("hide"); // removes hide class to show the button
    } else {

        console.log("not logged in")
        btnLogOut.addClass("hide"); // adds hide class to hide the button
    }
});


