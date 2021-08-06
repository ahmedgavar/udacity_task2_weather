// Creating a new date instance dynamically with JS
let d = new Date();
let newDate = d.toDateString();

// The URL to retrieve weather information from his API (country : US)
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";

// // Personal API Key for OpenWeatherMap API
// &units=metric to get the Celsius Temperature
const apiKey = ",&appid=3f810b9fa39d7810089ec5e41414e1f5&units=metric";

// the URL of the server to post data
const server = "http://127.0.0.1:5000";

// showing the error to the user
const error = document.getElementById("error");

//  fetch the data from API


const generateData = () => {
    //get value after click on the button
    const zip = document.getElementById("zip").value;
    const feelings = document.getElementById("feelings").value;

    // getWeatherData return promise
    getWeatherData(zip).then((data) => {
    
        if (data) {
            const { main: { temp }, } = data;

            const info = { newDate, temp, feelings, };

            postData(server + "/postall", info);

            showInHtml();
        }
    });
};

//  add function to button click
document.getElementById("generate").addEventListener("click", generateData);

// GET Web API response
const getWeatherData = async (zip) => {
    try {
        const res = await fetch(baseURL + zip + apiKey);
        const data = await res.json();

        if (data.cod != 200) {
            // display the error message on UI
            error.innerHTML = data.message;
            setTimeout(_ => error.innerHTML = '', 8000)
            throw `${data.message}`;
        }

        return data;
    } catch (error) {
        console.log(error);
    }
};

//  POST data to server
const postData = async (url = "", info = {}) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
    });

    try {
        const newData = await res.json();
        console.log(`You just saved`, newData);
        return newData;
    } catch (error) {
        console.log(error);
    }
};

// show data in html
const showInHtml = async () => {
    const res = await fetch(server + "/getall");
    try {
        const savedData = await res.json();

        document.getElementById("date").innerHTML = savedData.newDate;
        document.getElementById("temp").innerHTML = savedData.temp + '&degC';
        document.getElementById("content").innerHTML = savedData.feelings;
    } catch (error) {
        console.log(error);
    }
};
