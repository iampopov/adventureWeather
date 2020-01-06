//lets create some variables
var savedLocations = ["Winter Park", "Vail", "Copper", "A-Basin"];
// lets make some functions

//This function takes location array and uses it to populate the dropdown
function dropPop () {
    var dropDownMenu = $(".dropPop");
    dropDownMenu.empty();
    savedLocations.forEach(function (item) {
        var newButton = $("<button>").attr({"class":"dropdown-item", "data-value": item});
        newButton.text(item);
        dropDownMenu.append(newButton);
        
    })
}

//This function will be used to pull from local Storage savedLocations array
function localPull () {
    var pulledStorage = localStorage.getItem("Location-Array");
    console.log(pulledStorage);
    if (pulledStorage === null) {
        savedLocations = [];
    } else {
        savedLocations = pulledStorage.split(",");
    }
}

//Function call outs for testing
localPull();
dropPop();

//Creating on click events

//This is the click event for the add new location button
$("#newLocation").on("click", "button", newLocation);