import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { withState } from '../weather-context';
import icons from '../assets/icons.json';
import {instance,API_KEY} from '../axios';
import styles from './Forecast.module.css';

/* const API_KEY = process.env.API_KEY; */

const convertTemp = (k) => {
    const C = k - 273.15
    return parseFloat(C).toFixed(2);
}

const Forecast = (props) => {

    const [forecast, setForecast] = useState([]);
    const location = props.loc;
    const fetchData = async () => {
        const res = await instance(`onecall?lat=${location.lat}&lon=${location.lon}&exclude=minutely,current&appid=${API_KEY}`);
        setForecast(res.data.daily.slice(0, 5));
    }

    useEffect(() => {
        fetchData();
        const timer = setInterval(() => {
            fetchData();
        }, [500000]);
    }, [location]);


    const daySelectHandler = (data) => {
        props.setDayForecast(data);
        props.history.push('/day');
    }

    return (
        <div className={styles.Forecast}>
            {forecast.length !== 0 && <div className="d-flex flex-row">
                {forecast.map((data, index) => {
                    const iconType = icons.icons.find(x => x.label === data.weather[0].description)
                    const iconUrl = require(`../assets/icons/${iconType.icon}.png`).default;
                    return (
                        <div key={index} className={styles.Card + " " + "d-flex flex-column"} onClick={() => daySelectHandler(data)}>
                            <p className="h4">{moment(new Date((data.dt) * 1000)).format('dddd')}</p>
                            <p className="m-0">{data.weather[0].description}</p>
                            <div className={styles.WeatherIcon}>
                                <img src={iconUrl} alt="weatherIcon" />
                            </div>
                            <p className="m-1">Min_temp: {convertTemp(data.temp.min)}&deg;C</p>
                            <p className="m-1"> Max_temp: {convertTemp(data.temp.max)}&deg;C</p>

                            <p className="m-1">Humidity: {data.humidity}&#37;</p>
                            <p className="m-1">Wind Speed: {data.wind_speed + " "}mph</p>
                        </div>
                    );
                })}
            </div>}
        </div>
    );

};

export default withRouter(withState(Forecast));