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

//Function call outs for testing
dropPop();