//Project one js testing arena. Update comments as you go to make it easier to follow
//or remove if needed.


//lets create some variables
//These variables will last testing
var savedLocations = ["Winter Park", "Vail", "Copper", "A-Basin"];
var darkskyApiKey = "d2f367ae26a429b81b3e3148169f1332";

//These variables may or may not last testing
var latCurrent = '';
var lonCurrent = '';
var mainDiv = $('#mainDiv');

//location and search buttons

// lets make some functions

//get location
function getLocation(e) {
    e.preventDefault();
    var queryToken = `560c631ddab209`;
    var queryLoc = $('#inputBox').val().trim();
    var queryURL = `https://us1.locationiq.com/v1/search.php?key=${queryToken}&q=${queryLoc}&format=json`
    console.log($('#inputBox').val());
    console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
      mainDiv.html(" ");
      for (i=0; i<response.length; i++) {
        console.log(response[i].display_name);
        console.log(response[i]);
        console.log(response[i].lat);
        console.log(response[i].lon);
        var queryResult = $('<button/>',
        {
          id: 'locationBtn',
          text: response[i].display_name,
          latCurrent: response[i].lat,
          lonCurrent: response[i].lon
        }
        )
        //.value(response[i].display_name);
        //.lat(response[i].lat).lon(response[i].lon);
        queryResult.appendTo(mainDiv);
      }
      searchConfirm(latCurrent, lonCurrent);
    })
  
  }

  function searchConfirm (latCurrent, lonCurrent) {
      console.log($(this).latCurrent);
  }


//This function takes location array and uses it to populate the dropdown 
//this needs changed to create buttons for city options
function dropPop () {
    var dropDownMenu = $(".dropPop");
    dropDownMenu.empty();
    savedLocations.forEach(function (item) {
        var newButton = $("<button>").attr({"data-value": item});
        newButton.text(item);
        dropDownMenu.append(newButton);
        
    })
}

//This function will be used to pull from local Storage savedLocations array going to need changed to get objects
function localPull () {
    var pulledStorage = localStorage.getItem("Location-Array");
    console.log(pulledStorage);
    if (pulledStorage === null) {
        savedLocations = [];
    } else {
        savedLocations = pulledStorage.split(",");
    }
}

//This function will add a new location to the list of savedLocations.
//Will need other function call outs added to this function later to 
//populate the html with the info we want, for this stage this is good. 
//this will need changed to work with the buttons created for the search
function newLocation () {
    var siblingAry = $(this).siblings();
    var newLocation = siblingAry[0].value;
    savedLocations.push(newLocation);
    console.log(savedLocations);
    siblingAry[0].value = "";
    localPush();
    dropPop();
    pullDarksky();
}

//This function will push the savedLocations array to local storage will need changed for objects
function localPush () {
    var savedLocationsString = savedLocations.toString();
    localStorage.setItem("Location-Array", savedLocationsString);
}

//This function will make the ajax callout to pull information from darksky
function pullDarksky () {
    var proxy = "https://cors-anywhere.herokuapp.com/";
    var queryURL = "https://api.darksky.net/forecast/" + darkskyApiKey + "/" + latCurrent + "," + lonCurrent;
    $.ajax({
        url: proxy + queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
    })
}

//This function will make the ajax call to pull historical infor for the location
// function pullDarkskyPast () {
//     var proxy = "https://cors-anywhere.herokuapp.com/";
//     var queryURL = 

// }

//Function call outs for testing
localPull(); 
dropPop();


//Creating on click events

//This is the click event for the add new location button
$("#newLocation").on("click", "button", newLocation);
//on click of search shows search buttons
$('#searchButton').click(getLocation);
//on click of search buttons pushes lat & lon to dark weather
$('#mainDiv').on('click', '#locationBtn', searchConfirm);
//This section is for tempoary code tests delete when section is working

//IDs needed newLocation for the button 