## Adventure Weather

This is a weather application with enhanced search functionality to find current weather conditions in variety of locations including trailheads, trial, ski resorts and the many other points of interest for outdoor enthusiasts. 

## Application framework

```
As an outdoor person
I need an ability to search for the weather in the specific location
so that I can plan outdoor activities accordingly
```

## Technology

* Used the [OpenWeather API](https://openweathermap.org/api) to retrieve five day forecast.

* Used [DarkSky API](https://darksky.net/dev/docs) to pull the forecast including precipitation and wind speed.

* Used [locationIQ](https://locationiq.com/docs) to get specific location coordinates

* Used AJAX to hook into the API to retrieve data in JSON format.

* The app runs in the browser and feature dynamically updated HTML and CSS powered by jQuery.

* Includes a search history so that users can access their past search terms. Clicking on the city name should perform a new search that returns current and future conditions for that city. 

## Future Development

* Implement radar

* Implement dynamic updates for different seasons (background picture, welcome language)
