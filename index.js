const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]"); 
const userContainer = document.querySelector(".user-weather-container");
const grantAccess = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const notFound = document.querySelector("[data-notfound]");


//initial varialble needed
let currentTab = userTab;
const API_KEY = "7e4c2baeb77741aced940f6cb951763f";
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab) {
    if (clickedTab !== currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add('current-tab');

        if(!searchForm.classList.contains("active")) {
            //agar active nahi hai to vo invisible hai, to ab use visible krna padega
            userInfoContainer.classList.remove("active");
            grantAccess.classList.remove("active");
            searchForm.classList.add("active");
        } else {
            //agar vo visible hai, to use invisible krna padega
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getFromSessionStorage();
        }
    }
};

userTab.addEventListener("click" , function () {
        switchTab(userTab);
    });

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
} )


function getFromSessionStorage() {
    console.log("start");
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccess.classList.add("active");
    } else {
        let coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfoByCoordinates(coordinates);
    }
}

async function fetchUserWeatherInfoByCoordinates(coordinates) {
    const {lat, lon} = coordinates;
    grantAccess.classList.remove("active");
    loadingScreen.classList.add("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

        if(!coordinates) throw err;
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        notFound.classList.add("active");
    }
}

function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-clouds]");
    

    console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerText = `${weatherInfo?.clouds?.all}%`;

    
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
      } else {
        alert("Geolocation is not supported by this browser.");
      }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }

    sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfoByCoordinates(userCoordinates);
}

const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName == "") {
        
        return;
    } else {
        
        fetchUserWeatherInfoByCityName(cityName);
    }
});

async function fetchUserWeatherInfoByCityName(cityName) {
    searchForm.classList.remove("active");
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccess.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

        if(cityName !== weatherInfo?.name) throw err;

    }
   catch (err) {
        
       loadingScreen.classList.remove("active");
       userInfoContainer.classList.remove("active");
       notFound.classList.add("active");
        
    }


}