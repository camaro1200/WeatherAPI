import { hello, Node, LinkedList} from './LinkedListClass.js';

let loc = document.getElementById("location");
let tempicon = document.getElementById("temp-icon");
let tempvalue = document.getElementById("temp-value");
let pressure_txt = document.getElementById("pressure");
let humidity_txt = document.getElementById("humidity");
let wind_txt = document.getElementById("wind");
let climate_txt = document.getElementById("climate");
let cord_txt = document.getElementById("cord");


//refresh page;
const refresh = document.querySelector(".text-refresh")
refresh.addEventListener("click", ()=>print_func() )

function print_func(){
    console.log("refresh")
    window.location.reload()
}

// get current location using geographical cordinates
window.addEventListener("load" ,()=>{
    let long;
    let lat;

    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition((position =>
            {
                lat = position.coords.latitude
                long=position.coords.longitude;

                const api=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=f40dfba4f82e36fe59d1c2ebdea5ea12`

                fetch(api).then((response)=>
                {
                    return response.json();
                })

                    .then (data =>
                    {
                        const{name}=data;
                        const{temp}=data.main;
                        const{id, description}=data.weather[0];
                        const{pressure}=data.main;
                        const{humidity}=data.main;
                        const{deg}=data.wind
                        const{speed}=data.wind
                        const{lat}=data.coord
                        const{lon}=data.coord

                        loc.textContent=name
                        tempvalue.textContent= Math.round(temp-273);
                        wind_txt.textContent= speed + " m/s, " + deg
                        pressure_txt.textContent=pressure
                        humidity_txt.textContent=humidity
                        climate_txt.textContent=description
                        cord_txt.textContent = "[ " + lat + ", " + lon  + " ]"
                        var img_path = get_icon(id)
                        console.log(img_path)
                        tempicon.src = img_path


                        console.log(data)
                        console.log(data.main)
                        console.log(id)

                    })
            }
        ))
    }

    // loading from local storage
    var storage_items = localStorage.getItem('list')
    const items = storage_items .split(' ');
    for (var i = 0; i < items.length -1; i++){
        console.log("item " + items[i]);
        getWeather(items[i]);
    }
})

function get_icon(id){
    var weather_img = "empty"
    if (id<300 && id>200)
        var weather_img = "./imgs/thunderstorm.png"
    else if (id<400 && id>=300)
        weather_img = "./imgs/cloud.png"
    else if (id<600 && id>=500)
        weather_img =  "./imgs/rain.png"
    else if (id<700 && id>=600)
        weather_img = "./imgs/snow.png"
    else if (id<=800 && id>=700)
        weather_img = "./imgs/atmosphere.png"
    else if (id>800)
        weather_img = "./imgs/sun.png"

    return weather_img
}


// add new element


const div_container = document.getElementById("block-wrap")
var storage = new LinkedList();

//add_btn.addEventListener("click", AddNew)

function delete_func(block, name){
    var ind = storage.indexOf(name)
    console.log(name)
    storage.removeFrom(ind)
    localStorage.setItem('list', storage.getList())
    block.remove()
}

var block_cnt = 0
function AddNew(item){
    console.log("add")

    console.log(item)
    storage.add(item.name)
    localStorage.setItem('list', storage.getList())

    // block description
    const new_block = document.createElement("div")
    const new_description = document.createElement("div")
    const new_name= document.createElement("h3")
    const new_temp= document.createElement("div")
    const new_icon= document.createElement("img")
    const new_btn= document.createElement("button")

    //new_block.classList.add('div-shadow')
    new_description.classList.add('description-container')
    new_name.classList.add('name-block')
    new_temp.classList.add('temp-block')
    new_icon.classList.add('icon-block')
    new_btn.classList.add('btn-block')

    block_cnt = block_cnt + 1
    new_block.id = "block-" + block_cnt

    new_name.textContent=item.name
    new_temp.textContent=item.temp
    new_btn.textContent="x"
    new_icon.src = item.img

    div_container.appendChild(new_block)
    new_block.appendChild(new_description)
    new_description.appendChild(new_name)
    new_description.appendChild(new_temp)
    new_description.appendChild(new_icon)
    new_description.appendChild(new_btn)

    //block list
    const new_list= document.createElement("ul")

    const new_list_item_wind= document.createElement("li")
    const new_list_wind= document.createElement("div")
    const new_wind_desc= document.createElement("p")
    const new_wind= document.createElement("p")

    const new_list_item_cloud= document.createElement("li")
    const new_list_cloud= document.createElement("div")
    const new_cloud_desc= document.createElement("p")
    const new_cloud= document.createElement("p")

    const new_list_item_pressure= document.createElement("li")
    const new_list_pressure= document.createElement("div")
    const new_pressure_desc= document.createElement("p")
    const new_pressure= document.createElement("p")

    const new_list_item_humidity= document.createElement("li")
    const new_list_humidity= document.createElement("div")
    const new_humidity_desc= document.createElement("p")
    const new_humidity= document.createElement("p")

    const new_list_item_cord= document.createElement("li")
    const new_list_cord= document.createElement("div")
    const new_cord_desc= document.createElement("p")
    const new_cord= document.createElement("p")


    new_list.classList.add('main_list')

    new_list_wind.classList.add('description')
    new_wind_desc.textContent = "Wind"
    new_wind.textContent= item.wind

    new_list_cloud.classList.add('description')
    new_cloud_desc.textContent = "Cloudiness"
    new_cloud.textContent= item.cloud

    new_list_pressure.classList.add('description')
    new_pressure_desc.textContent = "Pressure"
    new_pressure.textContent= item.pressure

    new_list_humidity.classList.add('description')
    new_humidity_desc.textContent = "Humidity"
    new_humidity.textContent= item.humidity

    new_list_cord.classList.add('description')
    new_cord_desc.textContent = "Coords"
    new_cord.textContent= item.cords


    new_block.appendChild(new_list)

    new_list.appendChild(new_list_item_wind)
    new_list_item_wind.appendChild(new_list_wind)
    new_list_wind.appendChild(new_wind_desc)
    new_list_wind.appendChild(new_wind)

    new_list.appendChild(new_list_item_cloud)
    new_list_item_cloud.appendChild(new_list_cloud)
    new_list_cloud.appendChild(new_cloud_desc)
    new_list_cloud.appendChild(new_cloud)

    new_list.appendChild(new_list_item_pressure)
    new_list_item_pressure.appendChild(new_list_pressure)
    new_list_pressure.appendChild(new_pressure_desc)
    new_list_pressure.appendChild(new_pressure)

    new_list.appendChild(new_list_item_humidity)
    new_list_item_humidity.appendChild(new_list_humidity)
    new_list_humidity.appendChild(new_humidity_desc)
    new_list_humidity.appendChild(new_humidity)

    new_list.appendChild(new_list_item_cord)
    new_list_item_cord.appendChild(new_list_cord)
    new_list_cord.appendChild(new_cord_desc)
    new_list_cord.appendChild(new_cord)

    new_btn.addEventListener("click", ()=>delete_func(new_block, item.name))
}


class item {
    constructor(name, temp, img, wind, cloud, pressure, humidity, cords) {
        this.name = name;
        this.temp = Math.round(temp-273) + ' °C';
        this.img = get_icon(img)
        this.wind = wind;
        this.cloud = cloud;
        this.pressure = pressure;
        this.humidity = humidity;
        this.cords = cords
    }
}

const searchInput=document.getElementById("search-input");
const searchButton=document.getElementById("search-btn");

searchButton.addEventListener('click', (e)=>{
    e.preventDefault();
    getWeather(searchInput.value);
    searchInput.value=''
});

const getWeather=async (city)=>
{
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f40dfba4f82e36fe59d1c2ebdea5ea12`  )
            .catch((e)=>{console.log(e)});

        const weatherData = await response.json()



        const{name}=weatherData;
        const{temp}=weatherData.main;
        const{description, id}=weatherData.weather[0];
        const{pressure}=weatherData.main;
        const{humidity}=weatherData.main;
        const{wind}=weatherData
        const{deg}=weatherData.wind
        const{speed}=weatherData.wind
        const{lat}=weatherData.coord
        const{lon}=weatherData.coord

        //get_icon(id)
        console.log(weatherData)

        console.log("id")
        console.log(id)

        var my_cord = "[ " + lat + ", " + lon  + " ]"
        var my_wind = speed + " m/s, " + deg
        var x = new item(name, temp, id, my_wind, description, pressure, humidity, my_cord) ;
        AddNew(x)
    }
    catch(error)
    {
        alert('city not found')
        console.log(error)
    }
};


storage.getList()


