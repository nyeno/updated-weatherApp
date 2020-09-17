//const base ='https://api.openweathermap.org/data/2.5/weather?q=Lagos&appid=2a612744acca1e0e9951b65e45358875'
const key = '2a612744acca1e0e9951b65e45358875'

const date = new Date()

const searchCity = document.querySelector('.location')
const cityValue = document.querySelector('.location input')
const cityName = document.querySelector('.city')
const today = document.querySelector('.date')
const temp = document.querySelector('.temp')
const hiLow = document.querySelector('.hi-low')
const icon = document.querySelector('.icons')
const description = document.querySelector('.weather')
const humidity = document.querySelector('.humidity')
const bgCard =document.querySelector('.card')
const p = document.getElementsByTagName('p')
const card =document.querySelector('.card')



const celcius =(kel) => {
    cel = kel - 273.15
    return cel
}
// fetch data from openweathermap
const theCity = async (city) => {
    const baseURL = 'https://api.openweathermap.org/data/2.5/weather'
    const query = `?q=${city}&appid=${key}`

    const response = await fetch(baseURL+query)

    const data = await response.json()

    return data
}
// changing background color based on weather description
const season = (desc) =>{
    if(desc.includes('clouds')){
        bgCard.style.background = 'linear-gradient(to bottom,rgba(250, 250, 250,0.9), rgba(250,250,250,0)), url(img/clouds.jpg)'
    }
    if(desc.includes('rain')){
        bgCard.style.background = 'linear-gradient(to bottom,rgba(250, 250, 250,0.9), rgba(250,250,250,0)), url(img/rainy.jpg)'
    }
    if(desc.includes('thunder')){
        bgCard.style.background = 'linear-gradient(to bottom,rgba(250, 250, 250,0.9), rgba(250,250,250,0)), url(img/thunder.jpg)'
    }
    if(desc.includes('snow')){
        bgCard.style.background = 'linear-gradient(to bottom,rgba(250, 250, 250,0.9), rgba(250,250,250,0)), url(img/snow.jpg)'
    }
    if(desc.includes('mist')){
        bgCard.style.background = 'linear-gradient(to bottom,rgba(250, 250, 250,0.9), rgba(250,250,250,0)), url(img/mist.jpg)'
    }
    if(desc.includes('clear')){
        bgCard.style.background = 'linear-gradient(to bottom,rgba(250, 250, 250,0.9), rgba(250,250,250,0)), url(img/clear.jpg)'
    }

    card.classList.remove('display')
}
// night time background
const day = (time) => {
    if(time.includes('n')){
        bgCard.style.background = 'linear-gradient(to bottom,rgba(126, 148, 194, 0.233), rgb(9, 20, 58)), url(img/sunset.jpg)'
    }
    card.classList.remove('display')
}


// uodate the visuals here
const updateWeatherApp = (city) => {
    cityName.textContent = city.name + ",  " + city.sys.country
    today.textContent = dateBuilder(date)
    temp.textContent = `Temp: ${Math.round(celcius(city.main.temp))} \u00B0 C`
    let iconCode = city.weather[0].icon
    icon.innerHTML = `<img src ='http://openweathermap.org/img/wn/${iconCode}@4x.png' class='image'>`
    description.textContent = city.weather[0].description
    hiLow.innerHTML =` hi-low:  ${Math.round(celcius(city.main.temp_min))} &deg; C / ${Math.round(celcius(city.main.temp_max))} &deg; C`
    humidity.innerHTML = ` Humidity: ${city.main.humidity} % `
    season(city.weather[0].description)
    day(iconCode)
}


//enabling the form so that when it submits, the weather is shown
searchCity.addEventListener('submit', (event) => {
    event.preventDefault()

    const citySearched = cityValue.value.trim()
    console.log(citySearched)
    searchCity.reset()


    if ('caches' in window) {
        const baseURL = 'https://api.openweathermap.org/data/2.5/weather'
        const query = `?q=${citySearched}&appid=${key}`
        // Get cached weather data if exists
        caches.match(baseURL+query).then(function(response) {
          if (response) {
            response.json().then((json) =>{
                console.log(json)
                updateWeatherApp(json)
            });
          }
        });
      }
    if (setCity(citySearched)){
        const e = getCity(citySearched)
        updateWeatherApp(e)
    }
    else{
        theCity(citySearched)
        .then((data)=>{
            updateWeatherApp(data)
        })
    }

})

//Chack if to use local storage
const setCity = (id) => {
    if(localStorage.getItem(id) === null || localStorage.getItem(id) === undefined){
        theCity(id)
            .then((data) => {
                localStorage.setItem(id,JSON.stringify(data))
            })
            .catch((err)=> {
                alert(err)
        })
        return false
    }
    else{
        return true
    }
} 
const getCity = (id) => {
    const weatherap= JSON.parse(localStorage.getItem(id))
        console.log(weatherap)
        return weatherap
}


// building the dates
function dateBuilder (d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
  
    return `${day}, ${date}th ${month} ${year}`;
  }
 
  