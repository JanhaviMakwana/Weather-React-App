import React, { useState, useEffect } from 'react';
import { withState } from '../weather-context';
import CurrentWeather from '../CurrentWeather/CurrentWeather';
import HourlyWeather from '../HourlyWeather/HourlyWeather';
import Forecast from '../Forecast/Forecast';
import {instance,API_KEY} from '../axios';
import styles from './Home.module.css';

/* const API_KEY = '8724f6361faef2c68171d5561b48b8b2'; */

const Home = (props) => {

    const [currentCity, setCurrentCity] = useState(props.city.length !== 0 ? props.city.city: 'ahmedabad');
    const [currentWeather, setCurrentWeather] = useState([]);
    const [location, setLocation] = useState([]);

    const fetchData = async () => {
        const res = await instance(`weather?q=${currentCity}&appid=${API_KEY}`)
        setLocation(res.data.coord)
        props.setLocation(res.data.coord);
        props.setCity({ city: res.data.name, country: res.data.sys.country });
        setCurrentWeather(res.data);
    }

    useEffect(() => {
        
        fetchData();
        const timer = setInterval(() => {
            fetchData();
        }, [300000000]);
    }, []);

    const cityChangeHandler = (event) => {
        setCurrentCity(event.target.value);
    }

    const citySubmitHandler = (event) => {
        event.preventDefault();
        fetchData();
    };

    return (
        <div className={styles.Home} >
            <div>
                <form onSubmit={citySubmitHandler}>
                    <input
                        className="form-control"
                        type="text"
                        value={currentCity}
                        onChange={cityChangeHandler}
                        placeholder="Search City"
                    />
                </form>
                <div className="d-flex flex-column">
                    <div className="d-flex flex-row">
                        {currentWeather.length !== 0 && <CurrentWeather currentWeather={currentWeather} />}
                        {location.length !== 0 && <Forecast loc={location} />}
                    </div>
                    {location.length !== 0 && <HourlyWeather loc={location} />}
                </div>
            </div>
        </div>
    );

};

export default withState(Home);