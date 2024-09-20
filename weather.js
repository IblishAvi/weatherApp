const  UserTab    =  document.querySelector("[data-userweather]")
const  search_tab   =  document.querySelector("[data-searchweather]")
const  grantLocation =  document.querySelector(".grant-location-container")
const  searchForm    =  document.querySelector("[data-searchForm]")
const  loading    =  document.querySelector(".loading_container")
const  weatherContainer    =  document.querySelector("#container")
const  userInfo    =  document.querySelector("#user_info_container")


//initially needed variable

let currentTab = UserTab;
const API_key = '4614fe7171ac38f84fa3d16d613d2fdb';
currentTab.classList.add("Current-Tab");
getfromSessionStorage();


// Switching between tabs
function switchTab(clickedTab){
    if(currentTab!=clickedTab){
        currentTab.classList.remove('Current-Tab');
        currentTab =clickedTab;
        currentTab.classList.add("Current-Tab");
    }
    // check if search tab is invisible then make it visible.
    if(!searchForm.classList.contains('active')){
        userInfo.classList.remove('active');
        grantLocation.classList.remove('active');
        searchForm.classList.add('active');
    }
    // switched from search tab to weather tab.
    else{
        searchForm.classList.remove('active');
        userInfo.classList.remove('active');
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
    const localcoordinates =sessionStorage.getItem('user-coordinates');
    if(!localcoordinates){
        //if local coordinates are not present
        grantLocation.classList.add("active");

    }
    else{
        const coordinates= JSON.parse(localcoordinates)
        fetchUserWeatherInfo(coordinates);
        
    }
}
async function fetchUserWeatherInfo(coordinates) {
    const lat = coordinates.lat;
    const lon = coordinates.lon;
    
   
    
    
    
    // make grant invisible before showing location 
    grantLocation.classList.remove("active");
    // make loader visible 
    loading.classList.add('active');
    
    // API Call
    
    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await response.json();
        renderweatherInfo(data);
        
        // console.log(data);
    }
    catch(err){
        
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
    
    cityName.innerText =weatherInfo?.name;
    // Countrycode.src =
    weatherDesc.innerText =weatherInfo?.weather?.[0]?.description;
    // weatherIcon.src =
    temprature.innerText =weatherInfo?.main?.temp;
    windspeed.innerText =weatherInfo?.wind?.speed;
    humidity.innerText =weatherInfo?.main?.humidity;
    cloudness.innerText =weatherInfo?.clouds?.all;
}

const grantAccess = document.querySelector("[data-grantAccess]")
grantAccess.addEventListener('click',getlocation());

function getlocation(){
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

const cityname= document.querySelector('[data-searchInput]');
searchForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        const city = cityname.value;
        if(city ===""){
            return
        }
        else{
            searchLocation(city);
        }
})
async function searchLocation(city){
   loading.classList.add('active');
   userInfo.classList.remove('active');
   grantLocation.classList.remove('active');
   
    try{
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
    const res = await result.json()
    loading.classList.remove('active');
    userInfo.classList.add('active');

    renderweatherInfo(res);
    }
    catch(err){
        console.log(err);
        
    }


}
// const search = document.querySelector('#search');
// search.addEventListener('click', searchLocation());






















// const API_key = "4614fe7171ac38f84fa3d16d613d2fdb"
// console.log("hii ,Avi");

// async function FetchWeatherDetail(){
//     const city ="goa";

//     const response =await fetch(``);
//     const data = response.json();
//     console.log("data :",data);
    
// }


