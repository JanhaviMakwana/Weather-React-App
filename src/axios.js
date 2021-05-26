import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://api.openweathermap.org/data/2.5/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': "application/json"
    }
});

const API_KEY = 'YOUR_API_KEY';
export { instance, API_KEY };