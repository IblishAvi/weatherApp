const  UserTab    =  document.querySelector("[data-userweather]")
const  search_tab   =  document.querySelector("[data-searchweather]")
const  GrantAccessContainer =  document.querySelector(".grant-location-container")
const  searchForm    =  document.querySelector("[data-searchForm]")
const  loading    =  document.querySelector(".loading_container")
const  UserContainer    =  document.querySelector("#weather_container")
const  userInfoContainer   =  document.querySelector(".user_info_container")


//initially needed variable

let currentTab = UserTab;
const API_key = "4614fe7171ac38f84fa3d16d613d2fdb";
currentTab.classList.add("Current-Tab");
getfromSessionStorage();


// Switching between tabs
function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove('Current-Tab');
        currentTab =clickedTab;
        currentTab.classList.add("Current-Tab");
    }
    // check if search tab is invisible then make it visible.
    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        GrantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    // switched from search tab to weather tab.
    else{
        searchForm.classList.remove('active');
        userInfoContainer.classList.remove('active');
// display current tab which is userWeather tab.first check for local session storage if we have save them there.
        getfromSessionStorage();


    }
        
}

UserTab.addEventListener('click',()=>{
    switchTab(UserTab)
    
});

search_tab.addEventListener('click',()=>{
    switchTab(search_tab)
});

function getfromSessionStorage(){
    const localcoordinates = sessionStorage.getItem("user-coordinates");
    if(!localcoordinates){
        //if local coordinates are not present
        GrantAccessContainer.classList.add("active");

    }
    else{

        const coordinates= JSON.parse(localcoordinates)
        GrantAccessContainer.classList.remove("active");

        fetchUserWeatherInfo(coordinates);
        // my changes.
        // GrantAccessContainer.classList.remove("active");

        
    }
}
async function fetchUserWeatherInfo(coordinates) {
    const lat = coordinates.lat;
    const lon = coordinates.lon;
 // make grant invisible before showing location 
    GrantAccessContainer.classList.remove("active");
    // make loader visible 
    loading.classList.add('active');
    
    // API Call
    
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await response.json();
        console.log(data);
        loading.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderweatherInfo(data);

    }
    catch(err){
        loading.classList.remove("active")
        console.log("Api Na chalbo");

    }
    
}
function renderweatherInfo(weatherInfo){
    // firstly we have to fetch the element .
    
    const cityName = document.querySelector("[data-cityname]")
    const Countrycode = document.querySelector("[data-CountryImage]")
    const weatherDesc = document.querySelector("[data-weatherDesc]")
    const  weatherIcon= document.querySelector("[data-weatherIcon]")
    const temprature = document.querySelector("[data-temprature]")
    const windspeed = document.querySelector("[data-windspeed]")
    const  humidity= document.querySelector("[data-humidity]")
    const  cloudness= document.querySelector("[data-cloudness]")
    // console.log(cityName,Countrycode,weatherDesc,weatherIcon,temprature);
    
    cityName.innerText =weatherInfo?.name;
    weatherDesc.innerText =weatherInfo?.weather?.[0]?.description;
    temprature.innerText =`${weatherInfo?.main?.temp}°C`;
    windspeed.innerText =`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText =` ${weatherInfo?.main?.humidity} %`;
    cloudness.innerText =`${weatherInfo?.clouds?.all} %`;
    Countrycode.src=`https://flagcdn.com/16x10/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    
}

const grantAccess = document.querySelector("[data-grantAccess]")
grantAccess.addEventListener('click',getLocation);

function getLocation(){
    
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{
        console.log("Navigator not supported");
        
    }
}
function showposition(position){
        const usercoordinates ={
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        }
        //saving the coordinates in session storage. 
        sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinates))
        fetchUserWeatherInfo(usercoordinates);
    }

const SearchInput= document.querySelector('[data-searchInput]');
searchForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        let city = SearchInput.value;
        if(city ===""){
            return;
        }
        else{
           fetchSearchWeatherInfo(city);
        }
});
async function fetchSearchWeatherInfo(city){
   loading.classList.add('active');
   userInfoContainer.classList.remove('active');
   GrantAccessContainer.classList.remove('active');
   
    try{
    const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
    const res = await result.json();
    loading.classList.remove("active");
    userInfoContainer.classList.add('active');

    renderweatherInfo(res);
    }
    catch(err){
        console.log(err);
        
    }
}
