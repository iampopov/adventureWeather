//lets create some variables
var darkskyApiKey = "d2f367ae26a429b81b3e3148169f1332";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDK5d6qQRQPZ6uG5T_Ni0LJxZNQDf7lUHo",
    authDomain: "coadventureweather.firebaseapp.com",
    databaseURL: "https://coadventureweather.firebaseio.com",
    projectId: "coadventureweather",
    storageBucket: "coadventureweather.appspot.com",
    messagingSenderId: "966609177439",
    appId: "1:966609177439:web:f8c045894c37239e6804ea",
    measurementId: "G-DETTQJRNH6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var openWeatherApiKey = "9bd07f7d4ce4fe8a1ea716aadf106115";
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
var temp5day = [];
var date5day = [];

//get location - shows search results and assigns the key and the lat/lon pair to store in local storage
function getLocation(e) {
    e.preventDefault();
    var queryToken = `560c631ddab209`;
    var queryLoc = $('#inputBox').val().trim();
    var queryURL = `https://us1.locationiq.com/v1/search.php?key=${queryToken}&q=${queryLoc}&format=json`
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
    // preventing duplicates to be saved in a local storage
    database.ref().orderByChild("city").equalTo($(this).text()).once("value", snapshot => {
    if (snapshot.exists()){

    } else {
        //saving data to fireBase
        database.ref().push({
        city: cityArr[$(this).val()],
        lat: latArr[$(this).val()],
        lon: lonArr[$(this).val()]
    })
    }
});
    pullDarksky();
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

database.ref().on("child_added", function(renderButtons) {
    var savedLocations = $('<div>');
    savedLocations.empty();
    // latCurrent = renderButtons.val().lon;
    // lonCurrent = renderButtons.val().lat;
    var renderedLocation = $('<button/>',
            {
                id: 'locationBtn',
                text: renderButtons.val().city,
                "data-lon":renderButtons.val().lon,
                "data-lat":renderButtons.val().lat
                //value: i
            }
        ).css({
            'width': '100%',
            'white-space': 'normal',
            'height': 'auto'
        })
        renderedLocation.appendTo(savedLocations);
        savedLocations.appendTo('#sideDiv');
})



//This function will add a new location to the list of savedLocations.
//Will need other function call outs added to this function later to 
//populate the html with the info we want, for this stage this is good. 
//this will need changed to work with the buttons created for the search
function newLocation() {
    var siblingAry = $(this).siblings();
    var newLocation = siblingAry[0].value;
    siblingAry[0].value = "";
    localPush();
    pullDarksky();
}

//This function will push the savedLocations array to local storage will need changed for objects
// function localPush() {
//     var savedLocationsString = savedLocations.toString();
//     localStorage.setItem("Location-Array", savedLocationsString);
// }

//This function will make the ajax callout to pull information from darksky
function pullDarksky() {
    var proxy = "https://cors-anywhere.herokuapp.com/";
    var queryURL = "https://api.darksky.net/forecast/" + darkskyApiKey + "/" + latCurrent + "," + lonCurrent;
    $.ajax({
        url: proxy + queryURL,
        method: "GET"
    }).then(function (response) {
        day = response.currently.time;
        for (var i = 0; i < 3; i++) {
            dayAry[i] = day - ((i + 1) * 86400);
        }
        currentTemp = response.currently.temperature;
        currentFeelsLikeTemp = response.currently.apparentTemperature;
        currentWind = response.currently.windSpeed;
        pullDarkskyPast();
        fiveDayPull();
    })
}

//This function will make the ajax call to pull historical infor for the location
function pullDarkskyPast() {
    var i = 0;
    dayAry.forEach(function (item) {
        var proxy = "https://cors-anywhere.herokuapp.com/";
        var queryURL = `https://api.darksky.net/forecast/${darkskyApiKey}/${latCurrent},${lonCurrent},${item}`
        $.ajax({
            url: proxy + queryURL,
            method: "GET"
        }).then(function (response) {
            if (response.daily.data[0].precipType === "snow") {
                precipAccAry[i] = response.daily.data[0].precipAccumulation;
            } else {
                precipAccAry[i] = 0;
            }
            i++;
        })
    })


}

//this function will make an ajax call to open weather for a 5 day forcast
function fiveDayPull () {
    var queryURL3 = `http://api.openweathermap.org/data/2.5/forecast?lat=${latCurrent}&lon=${lonCurrent}&appid=${openWeatherApiKey}`;
    $.ajax({
        url: queryURL3,
        method: "GET"
    }).then(function(response){
        console.log(response);
        for (var i = 0; i < 5; i++){
            temp5day[i] =(((response.list[4+(i*8)].main.temp) - 273.15) * 9 / 5 + 32).toFixed(2);
            var dateTemp = response.list[4+(i*8)].dt_txt;
            dateTemp = dateTemp.split(" ");
            date5day[i] = dateTemp[0];
        }
        mainPop();
        pop5Day();
    })
}

function latlonsaved () {
    console.log(this)
    latCurrent = $(this).attr("data-lat");
    lonCurrent = $(this).attr("data-lon");
    pullDarksky();
}

//this function populates the 5 day forecast to the page
function pop5Day () {
    var fiveDay = $(".fiveDay");
    fiveDay.empty();
    for (var i = 0; i < 5; i++){
        var cardDiv = $("<div>").attr({
            "class":"cardDiv"
        })
        var temp = $("<p>").attr({
            "class":"temp"
        })
        var date = $("<p>").attr({
            "class":"date"
        })
        temp.text("Temp: " + temp5day[i] + "F");
        date.text(date5day[i]);
        cardDiv.append(date, temp);
        fiveDay.append(cardDiv);
    }
}
//Function call outs for testing

//Creating on click events

//This is the click event for the add new location button
$("#newLocation").on("click", "button", newLocation);
//on click of search shows search buttons
$('#searchButton').click(getLocation);
//on click of search buttons pushes lat & lon to dark weather
$('#mainDiv').on('click', '#locationBtn', updateStorage);
$("#sideDiv").on('click','button', latlonsaved);