const loc = document.getElementById("location");
const tempicon = document.getElementById("temp-icon");
const tempvalue = document.getElementById("temp-value");
const pressure_txt = document.getElementById("pressure");
const humidity_txt = document.getElementById("humidity");
const wind_txt = document.getElementById("wind");
const climate_txt = document.getElementById("climate");
const cord_txt = document.getElementById("cord");
const loader = document.querySelector(".loader");



export async function getJsonForCords(lat, long) {
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=f40dfba4f82e36fe59d1c2ebdea5ea12`
    return await fetch(api).then((response) => {
        {
            return response.json();
        }
    })
}

export function make_curr_location(item){
    loc.textContent = item.name;
    tempvalue.textContent = item.temp;
    wind_txt.textContent = item.wind;
    pressure_txt.textContent = item.pressure;
    humidity_txt.textContent = item.humidity;
    climate_txt.textContent = item.cloud;
    cord_txt.textContent = item.cords;
    tempicon.src = item.img;
    loader.className += " hidden";
}


export function get_curr_location() {
    return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                ({coords: {latitude, longitude}}) => {
                    resolve({latitude, longitude});
                },
                (error) => {
                    reject(error);
                }, {enableHighAccuracy: true}
            )
        }
    )
}

