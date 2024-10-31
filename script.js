// API key
const api_key = "9c5d0ab14a89b09845ed53502be4862a";

/* DOM ELEMENTS START*/
let cityInput = document.querySelector("#getCity");
const get_btn = document.querySelector(".btn-get");
const locate_btn = document.querySelector(".btn-locate");
let city_display = document.querySelector(".cityName");
const country = document.querySelector("#country");
const temp = document.querySelector(".temp");
const icon = document.querySelector(".weather-icon");
const weatherCondition = document.querySelector(".weather-condition");
const inputBox = document.querySelector('#getCity');
const recentSearches = document.querySelector(".dropdown");
const actionBtn = document.querySelectorAll('.btn-act');
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "April",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const timeD = document.querySelector(".time");
const dateD = document.querySelector(".date");
const dayD = document.querySelector(".day");

/* DOM ELEMENTS END*/

// GET LOCATION BUTTON ON CLICK
get_btn.addEventListener("click", () => {
  if(cityInput.value == ""){
    alert("please enter city!!")
  }
  findCoords(cityInput.value);
   saveSearch(cityInput.value);
  cityInput.value = "";
  const elements = document.querySelectorAll('card');
  elements.forEach(element => element.remove());
});


//find coordinate using name
function findCoords(cityName) {
  try {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`
    )
      .then((res) =>{ 
        if(!res.ok){
          alert("Invalid City");
        }else{
        return  res.json()
        }
        }
        )
      .then((data) => {
       console.log(data);
       display(data);
      });
  } catch (error) {
    console.log(`Error while fetching ${error}`);
  }
}

// fetching weather data using coordinates
async function fetchApi(data) {
  try {
    await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${data[0].lat}&lon=${data[0].lon}&exclude=hourly,minutely&units=metric&appid=${api_key}`
    )
      .then((res) => res.json())
      .then((data) => weatherdisplay(data));
      recentSearches.style.display = 'none';
  } catch (error) {
    console.log(`Error while fetching API data:${error}`);
  }
}
// displaying name of location
function display(data) {
  const country = data[0].country;
  const state = data[0].state;
  var locationE = `${data[0].name},${state},${country}`;
  city_display.innerHTML = locationE;
  fetchApi(data);
}

// displaying weatherData in form of cards
function weatherdisplay(data) {
 // console.log(data);
  data.daily.forEach((element, index) => {
    if (index == 0) {
      return;
    }
    cardCreate(element)
  });
  temp.innerHTML = `${data.current.temp} &deg;C`;
  icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png" alt="weatherIcon">`;
  weatherCondition.innerHTML = data.current.weather[0].description;
  document.querySelector(".value1").innerHTML = `${data.current.pressure} hPa`;
  document.querySelector(".value2").innerHTML = `${data.current.humidity}%`;
  document.querySelector(
    ".value3"
  ).innerHTML = `${data.current.wind_speed} km/h`;
  document.querySelector(
    ".value4"
  ).innerHTML = `${data.current.feels_like}&deg;C`;
  document.querySelector(".time-zone").innerHTML = data.timezone;
}

// time function for clock
setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursin12 = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  if (minutes < 10) {
    zero = 0;
  } else {
    zero = "";
  }
  const ampm = hour >= 12 ? "PM" : "AM";
  timeD.innerHTML = `<span class="text-red-600">${hoursin12}</span>:${zero}${minutes}<span id="am-pm"> ${ampm}</span>`;
  //timeD.innerHTML = hoursin12 + ':' + zero + minutes + ' ' + `<span id="am-pm">${ampm}</span>`
  dateD.innerHTML = date + " " + months[month];
  dayD.innerHTML = days[day];
}, 1000);


// find current location
locate_btn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((success) => {
    reverseFetch(success.coords.latitude, success.coords.longitude);
  });
});

// location name find using reverse from lat lon to location name 
async function reverseFetch(latitude, longitude) {
  try {
    fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`
    )
      .then((res) => res.json())
      .then((result) => display(result));
  } catch (error) {
    console.log("something went wrong" + error);
  }
}

// card creation to show future forecasts
function cardCreate(element) {
  
  const cardContainer = document.querySelector(".container");
  const card = document.createElement("div");
  card.classList.add(
    "card",
    "border-2",
    "border-gray-300",
    "p-5",
    "rounded-lg",
   );
  const dt = element.dt;
  const timestampInMilliseconds = dt * 1000;
  const time = new Date(timestampInMilliseconds);
  const date = time.getDate();
  const dayno = time.getDay();
  const month = time.getMonth();
  card.innerHTML = `
    <div class="daynday text-lg font-bold">${days[dayno]},${date} ${months[month]}</div>
   <div class="icon"><img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png" alt="weatherIcon"></div>
   <div class="temp text-5xl">${element.temp.day}&deg;C</div>
  <div class="windspeed">windspeed: ${element.wind_speed} KM/hr</div>
    `;
  cardContainer.appendChild(card);
   
}

// remove elements after click on any button
function removeElementsByClass(className) {
   const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(element => element.remove());
}
get_btn.addEventListener('click', () => {
    removeElementsByClass('card');
});
locate_btn.addEventListener('click', () => {
    removeElementsByClass('card');
});

// default City for this app
findCoords("New Delhi");

// Local Storage code section
inputBox.addEventListener('focus',()=>{
  recentSearches.style.display = 'block';
  loadSearches()
  // console.log(recentSearches);
})

// save recent searches to localstorage
const saveSearch = (search) => {
  const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
  if (!searches.includes(search)) {
      searches.push(search);
      localStorage.setItem('recentSearches', JSON.stringify(searches));
  }
};
// load searches from local storage
const loadSearches = () => {
  const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
  recentSearches.innerHTML = searches.length ? '<ul>' + searches.map(search => `<li class = "option">${search}</li>`).join('') + '</ul>' : 'No recent searches';
};

// drop list to search recent cities data
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('getCity');
  const searchDropdown = document.getElementById('recent-searches-list');

  searchInput.addEventListener('focus', () => {
      searchDropdown.style.display = 'block';
  });

  searchInput.addEventListener('blur', () => {
      setTimeout(() => {
          searchDropdown.style.display = 'none';
      }, 100); // Delay to allow click event to register
  });

  searchDropdown.addEventListener('mousedown', (event) => {
      event.preventDefault(); // Prevent blur event
  });

  searchDropdown.addEventListener('click', (event) => {
      if (event.target.tagName === 'LI') {
          searchInput.value = event.target.textContent;
          removeElementsByClass('card');
          findCoords(searchInput.value);
          searchDropdown.style.display = 'none';
      }
  });
});