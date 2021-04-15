import {LinkedList} from './LinkedListClass.js';

const loc = document.getElementById("location");
const tempicon = document.getElementById("temp-icon");
const tempvalue = document.getElementById("temp-value");
const pressure_txt = document.getElementById("pressure");
const humidity_txt = document.getElementById("humidity");
const wind_txt = document.getElementById("wind");
const climate_txt = document.getElementById("climate");
const cord_txt = document.getElementById("cord");
const loader = document.querySelector(".loader");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const div_container = document.getElementById("block-wrap");
const refresh = document.querySelector(".update_btn");

function get_icon(id) {
    var weather_img = "empty";
    if (id < 300 && id > 200)
        var weather_img = "./imgs/thunderstorm.png";
    else if (id < 400 && id >= 300)
        weather_img = "./imgs/cloud.png";
    else if (id < 600 && id >= 500)
        weather_img = "./imgs/rain.png";
    else if (id < 700 && id >= 600)
        weather_img = "./imgs/snow.png";
    else if (id <= 800 && id >= 700)
        weather_img = "./imgs/atmosphere.png";
    else if (id > 800)
        weather_img = "./imgs/sun.png";
    console.log("weathe path", weather_img)
    return weather_img;
}

function get_curr_location() {
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

function make_curr_location() {
    let p = get_curr_location()
    p.then((ans) => {
        let long = ans.longitude;
        let lat = ans.latitude;
        const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=f40dfba4f82e36fe59d1c2ebdea5ea12`
        fetch(api).then((response) => {
            return response.json();
        })
            .then(data => {
                loc.textContent = data.name;
                tempvalue.textContent = Math.round(data.main.temp - 273);
                wind_txt.textContent = data.wind.speed + " m/s, " + data.wind.deg;
                pressure_txt.textContent = data.main.pressure;
                humidity_txt.textContent = data.main.humidity;
                climate_txt.textContent = data.weather[0].description;
                cord_txt.textContent = "[ " + data.coord.lat + ", " + data.coord.lon + " ]";
                var img_path = get_icon(data.weather[0].id);
                tempicon.src = img_path;
                console.log('weateher-id2', data.weather[0].id);
            })
    }).catch((message) => {
        console.log("this is catch: " + message);
    })
}

// intermidiary part

//refresh page;
refresh.addEventListener("click", () => print_func());

function print_func() {
    window.location.reload();
}

const storage = new LinkedList();

window.addEventListener("load", () => {
    loader.className += " hidden";
    make_curr_location();

    // loading from local storage
    var storage_items = localStorage.getItem('list');
    const items = storage_items.split(' ');
    for (var i = 0; i < items.length - 1; i++) {
        get_weather_by_name(items[i]);
    }
})


// part2

function delete_func(block, name) {
    var ind = storage.indexOf(name);
    storage.removeFrom(ind);
    localStorage.setItem('list', storage.getList());
    block.remove();
}

function AddNew(item) {

    if (storage.indexOf(item.name) !== -1) {
        console.log("item already exits");
        return;
    } else {
        storage.add(item.name);
        localStorage.setItem('list', storage.getList());
    }

    let template = document.getElementById('my-template');
    const card = template.content.cloneNode(true);
    let card_name = card.querySelector('h3');
    let card_temp = card.querySelector('h1');
    let card_img = card.querySelector('img');
    let card_desc = card.querySelectorAll('p');
    let card_btn = card.querySelector('button');
    let card_div = card.querySelector('.block');

    card_name.textContent = item.name;
    card_temp.textContent = item.temp;
    card_img.src = item.img;
    card_desc[2].textContent = item.wind;
    card_desc[4].textContent = item.cloud;
    card_desc[6].textContent = item.pressure;
    card_desc[8].textContent = item.humidity;
    card_desc[10].textContent = item.cords;
    div_container.appendChild(card);

    card_btn.addEventListener("click", () => delete_func(card_div, item.name))
}

class item {
    constructor(name, temp, img, wind, cloud, pressure, humidity, cords) {
        this.name = name;
        this.temp = Math.round(temp - 273) + ' °C';
        this.img = get_icon(img);
        this.wind = wind;
        this.cloud = cloud;
        this.pressure = pressure;
        this.humidity = humidity;
        this.cords = cords;
    }
}

const get_weather_by_name = async (city) => {
    try {
        const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f40dfba4f82e36fe59d1c2ebdea5ea12`

        const response = await fetch(api)

        const weatherData = await response.json()

        const {name} = weatherData;
        const {temp} = weatherData.main;
        const {description, id} = weatherData.weather[0];
        const {pressure} = weatherData.main;
        const {humidity} = weatherData.main;
        const {wind} = weatherData;
        const {deg} = weatherData.wind;
        const {speed} = weatherData.wind;
        const {lat} = weatherData.coord;
        const {lon} = weatherData.coord;

        var my_cord = "[ " + lat + ", " + lon + " ]";
        var my_wind = speed + " m/s, " + deg;

        var x = new item(name, temp, id, my_wind, description, pressure, humidity, my_cord);
        AddNew(x);

        console.log("city-id", id);

    } catch (error) {
        alert('city not found');
        console.log(error)
    }
};

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    get_weather_by_name(searchInput.value);
    searchInput.value = '';
});
