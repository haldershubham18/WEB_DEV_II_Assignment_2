const API_KEY = "a913a939ae3edeed54ea030b08f973e0"

const form = document.querySelector("#form")
const city = document.querySelector("#city")           
const weatherDetail = document.querySelector(".info")
const searchHistory = document.querySelector(".historyBtn")
const consolePanel = document.querySelector(".console") 

let cityHistory = []


function logEvent(msg) {
    const line = document.createElement("div")
    line.className = "log-line"
    line.textContent = msg
    consolePanel.appendChild(line)
}

form.addEventListener('submit', async function (event) {
    event.preventDefault()
    consolePanel.innerHTML = ""              

    logEvent("Sync Start")

    const searchCity = city.value
    console.log(searchCity)

    logEvent("[ASYNC] Start fetching")

    setTimeout(() => {
        logEvent("setTimeout (Macrotask)")
    }, 0)

    logEvent("Sync End")


    // event.preventDefault()
    // const searchCity=city.value
    // console.log(searchCity)

    // const res =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}`)
    // const data = await res.json()
    
    // weatherInfo.innerHTML=`
    // <p>City: ${data.name}</p>
    // <p>Temperature: ${(data.main.temp-273.15).toFixed(2)}°C</p>
    // <p>Weather: ${data.weather[0].description}</p>
    // <p>Humidity: ${data.main.humidity}%</p>
    // <p>Wind Speed: ${data.wind.speed} m/s</p>
    // `
//     if (searchCity) {
//         try {
//             const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}`) 
//             const data = await res.json()
//             weatherInfo.innerHTML = `
//                 <p>City: ${data.name}</p>
//                 <p>Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C</p>
//                 <p>Weather: ${data.weather[0].description}</p>
//                 <p>Humidity: ${data.main.humidity}%</p>
//                 <p>Wind Speed: ${data.wind.speed} m/s</p>
//                 cityHistory.push(searchCity)
//                 <p>Search History: ${cityHistory.join(", ")}</p>
//             `
//         } catch (error) {
//             weatherInfo.innerHTML = `<p>Error fetching weather data. Please try again.</p>`
//         }




// })

    if (searchCity) {
        try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}`)

            
            Promise.resolve().then(() => {
                logEvent("Promise.then (Microtask)")
            })

            const data = await res.json()

            logEvent("[ASYNC] Data received")

            if (data.cod === 200) {
                weatherDetail.innerHTML = `
                <p>City: ${data.name}</p>
                <p>Temp: ${(data.main.temp - 273).toFixed(1)}C</p>
                <p>Weather: ${data.weather[0].main}</p>
                <p>Humidity: ${data.main.humidity}</p>
                <p>Wind: ${data.wind.speed}m/s</p>`

                cityHistory.push(searchCity)
                localStorage.setItem("cityHistory", JSON.stringify([...new Set(cityHistory)]))
                displayHistory()
            } else {
                weatherDetail.innerHTML = `<p>City not found</p>`
            }
        } catch (e) {
            console.log(e)
        }
    }
})

function displayHistory() {
    searchHistory.innerHTML = ""
    const history = JSON.parse(localStorage.getItem("cityHistory"))
    console.log(history)
    if (history) {
        history.forEach((city) => {
            const btn = document.createElement("button")
            btn.innerText = city
            btn.addEventListener("click", () => {         
                document.querySelector("#city").value = city
                form.dispatchEvent(new Event("submit", { bubbles: true }))
            })
            searchHistory.appendChild(btn)
        })
    }
}

displayHistory()