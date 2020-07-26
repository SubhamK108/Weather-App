

// Function to update weather
const UpdateWeather = async (lat, long, temperatureIcon) => {

    var temperatureDescription = document.querySelector(".tempDescription");
    var temperatureDegree = document.querySelector(".tempDegree");
    var temperatureUnit = document.querySelector(".tempUnit");
    var weatherLocation = document.querySelector(".locationName");

    const API = 'mCWChbcG7iVBKGCBekQ8LvG1OXYCVKHB';
    const cityAPI = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${API}&q=${lat},${long}`;

    // Get city data
    const city = await fetch(cityAPI);
    const cityJSON = await city.json();
    var cityID = cityJSON.Key;

    // Get weather data
    const weatherJSON = await GetWeatherDetails(cityID);
    var iconID = weatherJSON.WeatherIcon;

    // Update weather icon
    SetIcon(iconID);

    // console.log(cityJSON);
    // console.log(weatherJSON);

    // Set DOM elements
    weatherLocation.textContent = `${cityJSON.EnglishName}, ${cityJSON.AdministrativeArea.EnglishName}`;
    temperatureDegree.textContent = Math.round(weatherJSON.Temperature.Value);
    temperatureDescription.textContent = weatherJSON.IconPhrase;
    temperatureUnit.textContent = 'C/F';

}


// Function to get the weather details (JSON)
const GetWeatherDetails = async (cityID) => {

    const API = 'mCWChbcG7iVBKGCBekQ8LvG1OXYCVKHB';
    const weatherAPI = `https://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${cityID}?apikey=${API}&metric=true`;
    const weather = await fetch(weatherAPI);
    const weatherJSON = await weather.json();
    return weatherJSON[0];
}


// Function to get the weather icon
function SetIcon(iconID) {

    var temperatureIcon = document.querySelector(".weatherIcon");
    const skycons = new Skycons({"monochrome": false});
    const currentIcon = ICONS[iconID];
    skycons.play();
    return skycons.set(temperatureIcon, Skycons[currentIcon]);

}


window.addEventListener("load", () => {

    var errorClass = document.querySelector(".error");
    var temperatureDegree = document.querySelector(".tempDegree");
    var temperatureSection = document.querySelector(".tempDegreeSection");
    var temperatureUnit = document.querySelector(".tempUnit");
    
    if (navigator.geolocation) {
        
        errorClass.remove();

        navigator.geolocation.getCurrentPosition(position => {
            var long = position.coords.longitude;
            var lat = position.coords.latitude;
            
            // Update the weather
            UpdateWeather(lat, long);

            // Change temperature units
            temperatureSection.addEventListener('click', () => {

                if (temperatureUnit.textContent === 'C/F') {

                    let C = temperatureDegree.textContent;
                    let F = Math.round(((9 / 5) *  C) + 32);
                    temperatureDegree.textContent = F;
                    temperatureUnit.textContent = 'F/C';

                } else {

                    let F = temperatureDegree.textContent;
                    let C = Math.round(((F - 32) / 9) * 5);
                    temperatureDegree.textContent = C;
                    temperatureUnit.textContent = 'C/F';

                }
            })

        })
    }

})