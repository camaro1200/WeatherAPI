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
    //console.log("weathe path", weather_img)
    return weather_img;
}

class Item {
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

function getInfo(data){
    const {name} = data;
    const {temp} = data.main;
    const {description, id} = data.weather[0];
    const {pressure} = data.main;
    const {humidity} = data.main;
    const {wind} = data;
    const {deg} = data.wind;
    const {speed} = data.wind;
    const {lat} = data.coord;
    const {lon} = data.coord;

    const my_cord = "[ " + lat + ", " + lon + " ]";
    const my_wind = speed + " m/s, " + deg;

    return new Item(name, temp, id, my_wind, description, pressure, humidity, my_cord);
}

async function getJsonForCity(city) {
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f40dfba4f82e36fe59d1c2ebdea5ea12`
    return await fetch(api).then((response) => {
        return response.json();
    })
}

async function getJsonForCords(lat, long) {
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=f40dfba4f82e36fe59d1c2ebdea5ea12`
    return await fetch(api).then((response) => {
        {
            return response.json();
        }
    })
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


function make_curr_location(item){
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

// get current location
let coord_promise = get_curr_location()
coord_promise.then((ans) => {
    let long = ans.longitude;
    let lat = ans.latitude;
    const json_promise = getJsonForCords(lat, long)

    json_promise.then((ans) => {

        const item = getInfo(ans)
        make_curr_location(item)

    }).catch((message) => {
        console.log("json cord failed catch: " + message);
    })
}).catch((message) => {
    console.log("location failed catch: " + message);
    const city_promise = getJsonForCity("London")
    city_promise.then((ans) => {

        const item = getInfo(ans)
        make_curr_location(item)

    }).catch((message) => {
        alert('city not found');
        console.log("failed to fetch city2: " + message);
    })
})

// part 2
function delete_func(block, name) {
    let ind = storage.indexOf(name);
    storage.removeFrom(ind);
    localStorage.setItem('list', storage.getList());
    block.remove();
}

function add_new_card(item) {

    if (storage.indexOf(item.name) !== -1) {
        console.log("item already exits");
        return;
    } else {
        storage.add(item.name);
        localStorage.setItem('list', storage.getList());
    }

    let template = document.getElementById('my-template');
    const card = template.content.cloneNode(true);

    // const loader = card.querySelector('aside')
    // //loader.style.visibility = "hidden"
    // loader.className += " hidden";
    //
    // setTimeout(function(){
    //     loader.remove();
    // }, 2000);

    const card_name = card.querySelector('h3');
    const card_temp = card.querySelector('h1');
    const card_img = card.querySelector('img');
    const card_desc = card.querySelectorAll('p');
    const card_btn = card.querySelector('button');
    const card_div = card.querySelector('section');

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


searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const city_promise = getJsonForCity(searchInput.value)
    city_promise.then((ans) =>{
        add_new_card(getInfo(ans))
    }).catch((message) => {
        alert('city not found');
        console.log("failed to fetch city2: " + message);
    })

    searchInput.value = '';
});


//refresh page;
refresh.addEventListener("click", () => print_func());

function print_func() {
    window.location.reload();
}

let promiseArray = [];
const storage = new LinkedList();

window.addEventListener("load", () => {
    let storage_items = localStorage.getItem('list');
    const items = storage_items.split(' ');

    for (let i = 0; i < items.length - 1; i++) {
        promiseArray.push(getJsonForCity(items[i]))
    }

    Promise.all(promiseArray).then(() => {
        console.log(promiseArray.length)
            promiseArray.map((x) => {
                x.then(response => {
                    add_new_card(getInfo(response))
                });
            });
        }
    );

})

