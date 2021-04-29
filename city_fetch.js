import {LinkedList} from './LinkedListClass.js';
export let storage = new LinkedList();
const div_container = document.getElementById("block-wrap");

export async function getJsonForFavorite(city) {
    const api = `http://localhost:3000/weather/city?name=${city}`
    return await fetch(api).then((response) => {
        return response.json();
    })
}


export async function getJsonForCity(city) {
    //const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f40dfba4f82e36fe59d1c2ebdea5ea12`
    const api = `http://localhost:3000/weather/addCity?name=${city}`
    return await fetch(api, {method:"POST"}).then((response) => {
        return response.json();
    })
}

export function delete_func(block, name) {

    const ind = storage.indexOf(name);
    storage.removeFrom(ind);
    localStorage.setItem('list', storage.getList());
    block.remove();

    const api = `http://localhost:3000/weather/delCity?name=${name}`
    return fetch(api, {method:"DELETE"}).then((response) => {
        console.log("success");
    })
}

export function add_new_card(item) {

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


