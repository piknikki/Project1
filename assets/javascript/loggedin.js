/**
 * 
 * 
 *          this is the loggedin.js file
 * 
 * 
 */


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

 /**************************************************************************/
/*      function:       loadBookmark                                     */
/*                                                                        */
/*      purpose:        load the saved events from the database           */
/*                                                                        */
/*      parameters:     none                                              */
/*                                                                        */
/*      return:         none                                              */
/**************************************************************************/
function loadBookmark(_name, _city, _locLat, _locLong, _url, _desc, _pos, _rowNum) {

    var newCol = $("<div class='pricing-column col-md-4'></div>");
    var newCard = $("<div class='card'></div>");
    var newCardHeader = $("<div class='card-header'></div>");
    var eventTitle =  $("<h3>").text(_name);
    var eventCity = $("<h2>").text(_city);
    var desc = $("<p>").text(_desc);
    var newCardBody = $("<div class='card-body'></div>");

    linkToBuyTickets = $("<button id='disp-link-loc' btnid='" + _pos + "' class= 'btn btn-sm btn-block btn-outline-dark'>Buy</button>");
    linkToSavedTickets = $("<button id='disp-save-loc'  btnid='" + _pos + "' class= 'btn btn-sm btn-block btn-outline-dark'>Save</button>");

        newCardHeader.append(eventTitle);
        newCard.append(newCardHeader);
        newCardBody.append(eventCity);
        newCardBody.append(desc);
        newCardBody.append(linkToSavedTickets);
        newCardBody.append(linkToBuyTickets);
        newCard.append(newCardBody);
        newCol.append(newCard);

    // if i % 3 === 0 then there is a multiple of 3 in the current row
    //  so we need to create a new row
    if (_pos === 0) {
        var newRow = $("<div class='row r" + _rowNum + "'></div>");
        newRow.append(newCol);
        $("#t").append(newRow);

    }
    else if (_pos % 3 === 0) {
        // create a new row
        ++_rowNum;
        var newRow = $("<div class='row r" + _rowNum + "'></div>");
        newRow.append(newCol);
        $("#t").append(newRow);
    }
    else {
        var temp = ".r" + _rowNum;
        $(temp).append(newCol);
    }

}

/**************************************************************************/
/*      event:          firebase.database.on child added                  */
/*                                                                        */
/*      purpose:        populate the bookmarks page                       */
/**************************************************************************/
firebase.database().ref().on("value", function (_snapshot) {


    var i = 0;
    var rowNum = 0;

    _snapshot.forEach(function (_item) {

        var newCol = $("<div class='pricing-column col-md-4'></div>");
        var newCard = $("<div class='card'></div>");
        var newCardHeader = $("<div class='card-header'></div>");
        var eventTitle = $("<h3>").text(_item.val().name);
        var eventCity = $("<h2>").text(_item.val().city);
        var desc = $("<p>").text(_item.val().desc);
        var url = _item.val().url;

        var newCardBody = $("<div class='card-body'></div>");
        linkToBuyTickets = $("<button id='disp-link-loc' btnid='" + i + "' class= 'btn btn-sm btn-block btn-outline-dark'>Buy</button>");
      
         // click event for the event
         linkToBuyTickets.on("click", function () {
        
             var indexOfEvent = parseInt( $(this).attr("btnid"));
             location.href = url;

         });
        
        newCardHeader.append(eventTitle);
        newCard.append(newCardHeader);
        newCardBody.append(eventCity);
        newCardBody.append(desc);
        newCardBody.append(linkToBuyTickets);
        newCard.append(newCardBody);
        newCol.append(newCard);

        // if i % 3 === 0 then there is a multiple of 3 in the current row
        //  so we need to create a new row
        if (i === 0) {
            var newRow = $("<div class='row r" + rowNum + "'></div>");
            newRow.append(newCol);
            $("#t").append(newRow);

        }
        else if (i % 3 === 0) {
            // create a new row
            ++rowNum;
            var newRow = $("<div class='row r" + rowNum + "'></div>");
            newRow.append(newCol);
            $("#t").append(newRow);
        }
        else {
            var temp = ".r" + rowNum;
            $(temp).append(newCol);
        }
            i++;

    });

});