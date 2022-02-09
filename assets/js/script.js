var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-name");
var currentForecastEl = document.querySelector("#current-forecast");
var fiveDayForecastEl = document.querySelector("#five-day-forecast");
var savedBtnsContainer = document.querySelector("#saved-btns-container");

// handle form submission 
var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input el
    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getCurrentCoord(cityName);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city name");
    }

    console.log(event);
}

// display data to page
var getForecast = function(cities) {    
    var cityLat = cities.coord.lat;
    var cityLon = cities.coord.lon;    
    var nameOfCity = cities.name;
    
    console.log(nameOfCity)
    console.log(cityLat);
    console.log(cityLon);

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=imperial&appid=495edf2ac308d4a57ddcf5a8f95d9f88";

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayForecast(data, cities);
                    console.log(data, cities);
                });
            }
        })
        .catch(function(error) {
            alert("Unable to connect to Open Weather ")
        })

}

var displayForecast = function(cities, searchTerm) {
    // check if api returned data
    if (cities.length === 0) {
        currentForecastEl.textContent = "No cities found.";
        return;
    };

    // clear old content
    currentForecastEl.textContent = "";
    savedBtnsContainer.innerHTML = "<button class='button expanded margin'>" + searchTerm.value + "</button>";

    // getting data
    var currentTimestamp = cities.current.dt;
    var currentDate = new Date(currentTimestamp * 1000);
    var date = (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear();
    var uvIndex = cities.current.uvi;
    var currentTemp = cities.current.temp;
    var windSpeed = cities.current.wind_speed;
    var currentHumidity = cities.current.humidity;
    var weekForecast = cities.daily;
    
    // create and append variables to container
    var currentContainer = document.createElement("div")
    currentContainer.classList = "card"
    currentForecastEl.appendChild(currentContainer);    
    var cityNameList = document.createElement("h3");
    cityNameList.textContent = "cityNameEl " + "(" + date + ")";
    currentContainer.appendChild(cityNameList);
    var tempList = document.createElement("h4");
    tempList.textContent = "Temp: " + currentTemp + "°F";
    currentContainer.appendChild(tempList);
    var windList = document.createElement("h4");
    windList.textContent = "Wind: " + windSpeed + " MPH";
    currentContainer.appendChild(windList);
    var humidityList = document.createElement("h4");
    humidityList.textContent = "Humidity: " + currentHumidity + " %";
    currentContainer.appendChild(humidityList);
    var uvList = document.createElement("h4");
    uvList.innerHTML = "UV Index: " + "<span id='uv-span'>" + uvIndex + "</span>";
    currentContainer.appendChild(uvList);
    var uvDiv = document.querySelector("#uv-span");
    
    if (uvIndex > 6) {
        uvDiv.classList = "";
        uvDiv.classList = "red";
    } else if (uvIndex > 2) {
        uvDiv.classList = "";
        uvDiv.classList = "yellow";
    } else {
        uvDiv.classList = "";
        uvDiv.classList = "green";
    }
    
    // loop through 5 day forecast data and print it to page
    for (var i = 0; i < 5; i++) {
        
        // set variables
        var dateFive = weekForecast[i].dt;
        var tempFive = weekForecast[i].temp.day;
        var humidityFive = weekForecast[i].humidity;
        var windFive = weekForecast[i].wind_speed;

        // create and print elements to page
        var forecastCardDiv = document.createElement("div");
        forecastCardDiv.classList = "card";
        fiveDayForecastEl.appendChild(forecastCardDiv);

        
    }

    console.log(weekForecast);


}


// get the data from the api
var getCurrentCoord = function(city) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=495edf2ac308d4a57ddcf5a8f95d9f88";

    // make a request
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    getForecast(data, city);
                    console.log(data, city);
                });
            }
        })
        .catch(function(error) {
            alert("Unable to connect to Open Weather Map");
        });
};


// display response data on page
// save each search to list
// add error handling

cityFormEl.addEventListener("submit", formSubmitHandler);