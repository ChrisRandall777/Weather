let locationInput = document.getElementById("location")
let btn = document.getElementById("locButton")
let currTemp = document.getElementById("currTemp")
let currTempIcon = document.getElementById("currTempIcon")
let currTempCond = document.getElementById("condText")
let locText = document.getElementById("locationText")
let forecastDiv = document.getElementById("forecast")
let hourlyForcast = document.getElementById("hourlyForecast")
let high = document.getElementById("high")
let low = document.getElementById("low")

let weekdays = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]

btn.addEventListener("click", function(){
    getCurrentInfo(locationInput.value)
})

locationInput.addEventListener("keypress", function(e){
    if(e.code === "Enter" || e.code === "NumpadEnter"){
        getCurrentInfo(locationInput.value)
    }
})

function getCurrentInfo(search){
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=2deec64ff2a34bb7b86185000252905&q=${search}&days=7&aqi=no&alerts=no`, {
        method: "GET",

        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(res => {
        if(res.ok){
            locationInput.value = ""
            locationInput.style.backgroundColor = "aquamarine"
            res.json().then(data => {
            let currTempInfo = data.current
            let currLocInfo = data.location
            let forecastInfo = data.forecast
            
            updateCurrInfo(currTempInfo, currLocInfo, forecastInfo)
        })
        } else{
            locationInput.style.backgroundColor = "#FC6D6D"
            currTemp.innerHTML = ""
            currTempIcon.src = "https://freesvg.org/img/1603200920weather-symbol.png"
            currTempCond.innerHTML = ""
            locText.innerHTML = ""
            forecastDiv.innerHTML = ""
            hourlyForcast.innerHTML = ""
            hourlyForcast.style.overflowX = "unset"
            high.innerHTML = ""
            low.innerHTML = ""
        }
        
    })

    
}

function updateCurrInfo(currTempInfo, currLocInfo, forecastInfo){
    let temperature = Math.round(currTempInfo.temp_f)

    currTempIcon.src = currTempInfo.condition.icon
    currTempCond.innerHTML = currTempInfo.condition.text
    currTemp.innerHTML = temperature + "\u00B0F"
    locText.innerHTML = currLocInfo.name + ", " + currLocInfo.region + ", " + currLocInfo.country
    high.innerHTML = `High: ${Math.round(forecastInfo.forecastday[0].day.maxtemp_f)}\u00B0F`
    low.innerHTML = `Low: ${Math.round(forecastInfo.forecastday[0].day.mintemp_f)}\u00B0F`

    hourlyForcast.innerHTML = ""
    hourlyForcast.style.overflowX = "scroll"
    let date = new Date(currLocInfo.localtime)
    let hour = date.getHours()
    let hourInfo = forecastInfo.forecastday[0].hour
    for (let i = hour + 1; i < 24; i++) {
        let currHour = hourInfo[i]

        let newDiv = document.createElement("div")
        newDiv.setAttribute("class", "hourly")
        newDiv.innerHTML = `<h1>${militaryToAMPM(i)}</h1><img src=${currHour.condition.icon}><h1>${Math.round(currHour.temp_f)}\u00B0F</h1><h1>${currHour.chance_of_rain}%</h1>`
        hourlyForcast.appendChild(newDiv)
    }
    hourInfo = forecastInfo.forecastday[1].hour
    for (let i = 0; i < hour + 1; i++) {
        let currHour = hourInfo[i]

        let newDiv = document.createElement("div")
        newDiv.setAttribute("class", "hourly")
        newDiv.innerHTML = `<h1>${militaryToAMPM(i)}</h1><img src=${currHour.condition.icon}><h1>${Math.round(currHour.temp_f)}\u00B0F</h1><h1>${currHour.chance_of_rain}%</h1>`
        hourlyForcast.appendChild(newDiv)
    }

    forecastDiv.innerHTML = "<h1>6-Day Forecast</h1><div class=\"break\"></div>"
    forecastInfo.forecastday.forEach((day, i) => {
        if(i != 0){
            let newDiv = document.createElement("div")
            let date = new Date(day.date)

            newDiv.setAttribute("class", "forecastDay")
            newDiv.innerHTML = `<h1>${weekdays[date.getDay()]}</h1><img src=${day.day.condition.icon}><h1>${Math.round(day.day.maxtemp_f)}\u00B0F</h1><h1>${Math.round(day.day.mintemp_f)}\u00B0F</h1>`
            forecastDiv.appendChild(newDiv)
        }
        
    })

}

function militaryToAMPM(mTime){
    let t = mTime % 12
    if(t === 0)
        t = 12
    
    return String(t) + (mTime >= 12 ? "PM" : "AM")
}
