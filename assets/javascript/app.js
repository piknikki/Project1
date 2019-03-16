

var city = "";
var apiKey = "fN2JT7PZlbQ8jAFoGeun4pAKP8Rg8y5z";
var qs = "";

$("#search_button").on("click", function (event) {

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
        console.log(response._embedded.events);

        // find long and lat
       // console.log(qs);
        // createEventLink();
    }


    );
});

function createEventLink(lstOfEvents) {

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

}