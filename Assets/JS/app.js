

// Function to update weather
const UpdateWeather = async (lat, long) => {

    var temperatureDescription = document.querySelector(".tempDescription");
    var temperatureDegree = document.querySelector(".tempDegree");
    var temperatureUnit = document.querySelector(".tempUnit");
    var weatherLocation = document.querySelector(".locationName");
    var errorClass = document.querySelector(".error");

    const API = '41lLMbZLvlLpHzlmw4GJ9G8iActG7U0U';
    const cityURL = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${API}&q=${lat},${long}&toplevel=false`;

    try {

        // Get city data
        var city = await fetch(cityURL);
        var cityJSON = await city.json();
        var cityID = cityJSON.Key;

        // Get weather data
        var weatherJSON = await GetWeatherDetails(cityID);
        var iconID = weatherJSON.WeatherIcon;

        errorClass.remove();

    } catch (error) {
        
        errorClass.textContent = 'The daily limit of API Calls has been exhausted. Please wait till Subham renews the API';

    }

    // Update weather icon
    SetIcon(iconID);

    // console.log(cityJSON);
    // console.log(weatherJSON);

    // Set DOM elements
    weatherLocation.textContent = `${cityJSON.EnglishName}, ${cityJSON.AdministrativeArea.EnglishName}`;
    temperatureDegree.textContent = Math.round(weatherJSON.Temperature.Metric.Value);
    temperatureUnit.textContent = '°C/F';
    temperatureDescription.textContent = weatherJSON.WeatherText;

}


// Function to get the weather details (JSON)
const GetWeatherDetails = async (cityID) => {

    const API = '41lLMbZLvlLpHzlmw4GJ9G8iActG7U0U';
    const weatherURL = `https://dataservice.accuweather.com/currentconditions/v1/${cityID}?apikey=${API}`;
    const weather = await fetch(weatherURL);
    const weatherJSON = await weather.json();
    return weatherJSON[0];
}


// Function to get the weather icon
const SetIcon = async (iconID) => {

    var temperatureIcon = document.querySelector(".weatherIcon");
    const skycons = new Skycons({"monochrome": false});
    const currentIcon = ICONS[iconID];
    skycons.play();
    return skycons.set(temperatureIcon, Skycons[currentIcon]);
}


window.addEventListener("load", () => {

    var temperatureSection = document.querySelector(".tempDegreeSection");
    var temperatureDegree = document.querySelector(".tempDegree");
    var temperatureUnit = document.querySelector(".tempUnit");
    var errorClass = document.querySelector(".error");
    
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(position => {

            errorClass.textContent = 'Fetching weather data of your current location';

            var long = position.coords.longitude;
            var lat = position.coords.latitude;
            
            // Update the weather
            UpdateWeather(lat, long);

            // Change temperature units
            temperatureSection.addEventListener('click', () => {

                if (temperatureUnit.textContent === '°C/F') {

                    let C = temperatureDegree.textContent;
                    let F = Math.round(((9 / 5) *  C) + 32);
                    temperatureDegree.textContent = F;
                    temperatureUnit.textContent = '°F/C';

                } else {

                    let F = temperatureDegree.textContent;
                    let C = Math.round(((F - 32) / 9) * 5);
                    temperatureDegree.textContent = C;
                    temperatureUnit.textContent = '°C/F';

                }
            })

        })
    }

})