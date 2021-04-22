export function get_icon(id) {
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

export class Item {
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

export function getInfo(data){
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

