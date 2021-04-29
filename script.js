import {LinkedList} from './LinkedListClass.js';
import {get_icon, Item, getInfo} from './helper.js'
import {get_curr_location, make_curr_location, getJsonForCords} from "./cordinate_fetch.js";
import {delete_func, storage, add_new_card, getJsonForCity, getJsonForFavorite} from "./city_fetch.js";

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const refresh = document.querySelector(".update_btn");


// print current location
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


// create city card
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


async function getJsonList(){
    const api = `http://localhost:3000/weather/getCities`
    return await fetch(api).then((response) => {
         return response.json()
    }).then((ans) =>{
        let arr = [];
        //console.log(ans)
        for (let i = 0; i < ans.length; i++){
            arr.push(getJsonForFavorite(ans[i]));
        }
        return arr
    })
}

// loading content
let promiseArray = [];
window.addEventListener("load", async () => {

    const my_arr = await getJsonList()
    console.log(my_arr)
    console.log("arr len " + my_arr.length)

    Promise.all(my_arr).then(() => {
            console.log(my_arr)
            my_arr.map((x) => {
                console.log(x)
                x.then(response => {
                    //console.log(response)
                    add_new_card(getInfo(response))
                });
            });
        }
    );


    // let storage_items = localStorage.getItem('list');
    // const items = storage_items.split(' ');
    //
    // for (let i = 0; i < items.length - 1; i++) {
    //     //promiseArray.push(getJsonForCity(items[i]))
    //     promiseArray.push(getJsonForFavorite(items[i]))
    // }
    //
    // console.log(promiseArray)
    // console.log("prom len " + promiseArray.length)
    //
    // Promise.all(promiseArray).then(() => {
    //     console.log(promiseArray.length)
    //         promiseArray.map((x) => {
    //             x.then(response => {
    //                 add_new_card(getInfo(response))
    //             });
    //         });
    //     }
    // );

})

//refresh page;
refresh.addEventListener("click", () => print_func());

function print_func() {
    window.location.reload();
}
