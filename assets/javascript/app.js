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

    // clear any events from previous searches
    clearSearchResults();

    // get the results from the search
    var searchTitle = $("#searchKeyword").val(); 

    // prevent the form from submitting
    event.preventDefault();

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
        // response
        console.log(response);

        // try this block of code 
        try {
            // store each event that comes back from the list
            response._embedded.events.forEach(function (_event) {

                listOfEvents.push(_event);
            })
        }
        catch (e) {

            // if we are here something failed in the try block
            alert("_embedded undefined");
            console.log(e);
        }

        // create the links to the events
        createEventLinks();
    }


    );
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
function addEventToBookmarks(_name, _city, _locLat, _locLong, _url, _desc) {
    
       // increase the number of book marks
       numBookmarks++;

    database.ref().push({
        numBookmarks: numBookmarks,
        name: _name,
        city: _city,
        locLatitude: _locLat,
        locLongitude: _locLong,
        url: _url,
        desc: _desc
    });
}

firebase.database().ref().on("child_added", function (_snapshot) {
    

    for (var i = 0; i < _snapshot.length; ++i) {
       
     
        // create the event link
        loadBookmark(_snapshot[i].name,
            _snapshot[i].city,
            0,
            0,
            _snapshot[i].url,
            _snapshot[i].desc,
            i
        );
    }
    
});


/**************************************************************************/
/*      function:       loadBookmark                                     */
/*                                                                        */
/*      purpose:        load the saved events from the database           */
/*                                                                        */
/*      parameters:     none                                              */
/*                                                                        */
/*      return:         none                                              */
/**************************************************************************/
function loadBookmark(_name, _city, _locLat, _locLong, _url, _desc, _pos) {

    var newCol = $("<div class='pricing-column col-md-4'></div>");
    var newCard = $("<div class='card'></div>");
    var newCardHeader = $("<div class='card-header'></div>");
    var eventTitle = _name;
    var eventCity = _city;
    var desc = _desc;
    var linkToTicketsBTN = "";
    var linkToTicketsURL = _url;

    var newCardBody = $("<div class='card-body'></div>");

    linkToTicketsBTN = $("<button class='btn btn-lg btn-block btn-outline-dark'>Buy</button>");

    newCardHeader.append(eventTitle);
    newCard.append(newCardHeader);

    newCardBody.append(eventCity);
    newCardBody.append(desc);
    newCardBody.append(linkToTicketsBTN);
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

    // create the links to the events
    var rowNum = 0;
    for (var i = 0; i < listOfEvents.length; ++i) {


        var newCol = $("<div class='pricing-column col-md-4'></div>");
        var newCard = $("<div class='card'></div>");
        var newCardHeader = $("<div class='card-header'></div>");
        var eventTitle = "";
        var eventCity = "";
        var desc = "";

        var linkToTicketsBTN = "";
        var linkToTicketsURL = "";

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

            linkToTicketsURL = "";
            linkToTickets = $("<button id='disp-link-loc'class='btn btn-sm btn-block btn-outline-dark'>Buy</button>");

        }
        catch (e) {
            linkToTicketsURL = "url not found";
        }
      
        linkToTicketsBTN = $("<button class='btn btn-lg btn-block btn-outline-dark'>Buy</button>");
       
        
        // click event for the event
        linkToTicketsBTN.on("click", function () {
            var decription = "";
            var city = "";
            var title = "";
            try{
                decription = desc.text();
            }
            catch (e) {
                decription = desc;
            }
            try {
                city = eventCity.text();
            }
            catch (e) {
                city = eventCity;
            }
            try {
                title = eventTitle.text();
            }
            catch (e) {
                title = eventTitle;
            }


            // store the info into the database
            addEventToBookmarks(title, city, 0, 0, "", decription);

        });

        newCardHeader.append(eventTitle);
        newCard.append(newCardHeader);

        newCardBody.append(eventCity);
        newCardBody.append(desc);

        newCardBody.append(linkToTicketsBTN);

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