//Project one js testing arena. Update comments as you go to make it easier to follow
//or remove if needed.


//lets create some variables
//These variables will last testing
var savedLocations = ["Winter Park", "Vail", "Copper", "A-Basin"];
var darkskyApiKey = "d2f367ae26a429b81b3e3148169f1332";

//These variables may or may not last testing

var cityArr = [];
var latArr = [];
var lonArr = [];
var mainDiv = $('#mainDiv');
var currentTemp = 0;
var currentFeelsLikeTemp = 0;
var day = 0;
var dayAry = [];
var latCurrent = 39.8868;
var lonCurrent = -105.7625;
var precipAccAry = ["","",""];
var currentWind = 0;

//location and search buttons

// lets make some functions

//get location - shows search results and assigns the key and the lat/lon pair to store in local storage
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
    }).then(function (response) {
        mainDiv.html(" ");
        for (i = 0; i < response.length; i++) {

            var queryResult = $('<button/>',
                {
                    id: 'locationBtn',
                    text: response[i].display_name,
                    value: i
                }
            ).css({
                'width': '100%',
                'white-space': 'normal',
                'height': 'auto'
            })
            cityArr.push(response[i].display_name);
            latArr.push(response[i].lat);
            lonArr.push(response[i].lon);
            queryResult.appendTo(mainDiv);
        }
    })
    $("#inputBox").val("");
}
// saving clicked search results to local storage
function updateStorage() {
    coordinatesArr = [latArr[$(this).val()], lonArr[$(this).val()]];
    localStorage.setItem(cityArr[$(this).val()], JSON.stringify(coordinatesArr));
    latCurrent = latArr[$(this).val()];
    lonCurrent = lonArr[$(this).val()];
    pullDarksky();
    // mainPop();
}

//function to populate main div 
function mainPop() {
    $("#mainDiv").empty();
    var snowfallDiv = $("<div>").attr({
        "class": "snowfall"
    })
    var tempDiv = $("<div>").attr({
        "class": "temp"
    })
    var windDiv = $("<div>").attr({
        "class": "wind"
    })
    windDiv.text(`Wind speed: ${currentWind} mph`);
    tempDiv.text(`Current Temp: ${currentTemp} F  Feels Like: ${currentFeelsLikeTemp} F`)
    snowfallDiv.text(`Snowfall: Past 24 hours: ${precipAccAry[0]}" Past 48 hours: ${precipAccAry[0] + precipAccAry[1]}" Past 72 hours: ${precipAccAry[0] + precipAccAry[1] + precipAccAry[2]}"`);
    $("#mainDiv").append(snowfallDiv, tempDiv, windDiv);


}

function renderSavedCities() {
    var savedLocations = $('<div>');

    for (i = 0; i < localStorage.length; i++) {
        var currentArr = JSON.parse(localStorage.getItem(localStorage.key(i)));

        var renderedLocation = $('<button/>',
            {
                id: 'locationBtn',
                text: localStorage.key(i),
                value: i
            }
        ).css({
            'width': '100%',
            'white-space': 'normal',
            'height': 'auto'
        })
        renderedLocation.appendTo(savedLocations);
    }
    savedLocations.appendTo('#sideDiv');
}
// renderSavedCities();

//This function takes location array and uses it to populate the dropdown 
//this needs changed to create buttons for city options
function dropPop() {
    var dropDownMenu = $(".dropPop");
    dropDownMenu.empty();
    savedLocations.forEach(function (item) {
        var newButton = $("<button>").attr({ "data-value": item });
        newButton.text(item);
        dropDownMenu.append(newButton);

    })
}

//This function will be used to pull from local Storage savedLocations array going to need changed to get objects
function localPull() {
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
function newLocation() {
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
function localPush() {
    var savedLocationsString = savedLocations.toString();
    localStorage.setItem("Location-Array", savedLocationsString);
}

//This function will make the ajax callout to pull information from darksky
function pullDarksky() {
    var proxy = "https://cors-anywhere.herokuapp.com/";
    var queryURL = "https://api.darksky.net/forecast/" + darkskyApiKey + "/" + latCurrent + "," + lonCurrent;
    $.ajax({
        url: proxy + queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        day = response.currently.time;
        for (var i = 0; i < 3; i++) {
            dayAry[i] = day - ((i + 1) * 86400);
        }
        currentTemp = response.currently.temperature;
        currentFeelsLikeTemp = response.currently.apparentTemperature;
        currentWind = response.currently.windSpeed;
        console.log(day);
        console.log(day - dayAry[2]);
        pullDarkskyPast();
    })
}

//This function will make the ajax call to pull historical infor for the location
function pullDarkskyPast() {
    var i = 0;
    dayAry.forEach(function (item) {
        console.log(item);
        var proxy = "https://cors-anywhere.herokuapp.com/";
        var queryURL = `https://api.darksky.net/forecast/${darkskyApiKey}/${latCurrent},${lonCurrent},${item}`
        $.ajax({
            url: proxy + queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log(response.daily.data[0].precipType);
            if (response.daily.data[0].precipType === "snow") {
                precipAccAry[i] = response.daily.data[0].precipAccumulation;
            } else {
                precipAccAry[i] = 0;
            }
            console.log(precipAccAry[i]);
            console.log(precipAccAry);
            console.log(i);
            i++;
            mainPop();
        })
    })

}

//Function call outs for testing
localPull();
dropPop();


//Creating on click events

//This is the click event for the add new location button
$("#newLocation").on("click", "button", newLocation);
//on click of search shows search buttons
$('#searchButton').click(getLocation);
//on click of search buttons pushes lat & lon to dark weather
$('#mainDiv').on('click', '#locationBtn', updateStorage);
//This section is for tempoary code tests delete when section is working

//IDs needed newLocation for the button 