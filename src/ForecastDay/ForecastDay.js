import React, { useEffect, useState } from 'react';
import {instance,API_KEY} from '../axios';
import { withState } from '../weather-context';
import moment from 'moment';
import Wind from '../wind';
import iconsData from '../assets/icons.json';
import styles from './ForecastDay.module.css';

/* const API_KEY = process.env.API_KEY; */

const convertTemp = (K) => {
    const C = K - 273.15
    return parseFloat(C).toFixed(2);
}


const style = {
    width: '15px',
    height: '15px'
}

const ForecastDay = (props) => {
    const location = props.location
    const [current, setCurrent] = useState(props.dayForecast);
    const [hourly, setHourly] = useState([]);
    const date = moment(new Date((current.dt) * 1000)).format('YYYY-MM-DD')

    const fetchData = async () => {
        const res = await instance.get(`http://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`);
        const filter = res.data.list.filter(x => x.dt_txt.match(date))
        setHourly(filter);
    }

    useEffect(() => {
        fetchData();
        const timer = setInterval(() => {
            fetchData();
        }, [300000000]);
    }, []);

    const pressureIcon = require('../assets/gauge.png').default;
    const sagittarius = require('../assets/sagittarius.png').default;

    const currentDate = moment(new Date((current.dt) * 1000))
    const iconType = iconsData.icons.find(x => x.label === current.weather[0].description)
    const weatherIcon = require(`../assets/icons/${iconType.icon}.png`).default;

    return (
        <div className={styles.ForecastDay}>
            <div className="d-flex flex-column">

                <button className="btn btn-outline-light mb-1" onClick={() => { props.history.push('/') }}>
                    BACK
                </button>

                <div className={"d-flex flex-row" + styles.Current}>
                    <div className={styles.Section1}>
                        <p className="display-5 m-0">{props.city.city}, {props.city.country}</p>
                        <p className="h5">{currentDate.format('dddd') + ", "
                            + currentDate.format('M') + " "
                            + currentDate.format('MMM') + " "
                            + currentDate.format('YYYY')}
                        </p>
                        <div className={styles.Weather}>
                            <img src={weatherIcon} alt={iconType} />
                            <p className="h6">{" " + current.weather[0].description}</p>
                        </div>
                    </div>
                    <div className={styles.Section2}>
                        <div className="d-flex flex-row flex-wrap">
                            <div className={styles.WeatherInfo}>
                                <p>Min Temperature</p>
                                <p>{convertTemp(current.temp.min)} &deg;C</p>
                            </div>
                            <div className={styles.WeatherInfo}>
                                <p>MaxTemperature</p>
                                <p> {convertTemp(current.temp.max)}&deg;C</p>
                            </div>
                            <div className={styles.WeatherInfo}>
                                <p>Wind Speed</p>
                                <p>{current.wind_speed + " "}mph{" " + Wind.getDirection(current.wind_deg)} </p>
                            </div>
                            <div className={styles.WeatherInfo}>
                                <p>Humidity</p>
                                <p> {current.humidity}&#37;</p>
                            </div>
                            <div className={styles.WeatherInfo}>
                                <p>Sunrise</p>
                                <p>{moment(new Date((current.sunrise) * 1000)).format('hh:mm a')}</p>
                            </div>
                            <div className={styles.WeatherInfo}>
                                <p>Sunset</p>
                                <p>{moment(new Date((current.sunset) * 1000)).format('hh:mm a')}</p>
                            </div>
                        </div>
                    </div>

                </div>
                <div className={styles.HourlyData}>
                    <div style={{ overflowX: 'scroll' }}>
                        <div className="d-flex flex-row">
                            {hourly.map((data, index) => {
                                const iconType = iconsData.icons.find(x => x.label === data.weather[0].description)
                                const iconUrl = require(`../assets/icons/${iconType.icon}.png`).default;
                                return (
                                    <div key={index}>
                                        <div className={styles.Hour}>
                                            <p>{moment(new Date((data.dt) * 1000)).format('hh:mm a')}</p>
                                            <p>{data.weather[0].description}</p>
                                            <div><img src={iconUrl} alt={iconType} /></div>
                                            <div>
                                                <p> {convertTemp(data.main.temp)}&deg; C</p>
                                                <p> Min_temp:{" " + convertTemp(data.main.temp_min)} </p>
                                                <p> Max_temp:{" " + convertTemp(data.main.temp_max)} </p>
                                                <p>Humidity:{" " + data.main.humidity}&#37; </p>
                                            </div>
                                            <div>
                                                <img src={pressureIcon} style={style} alt="pressure" />
                                                {data.main.pressure}Pa
                                            </div>
                                            <div>
                                                <img src={sagittarius} style={style} alt="wind" />
                                                {data.wind.speed + " "}mph{" " + Wind.getDirection(data.wind.deg)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withState(ForecastDay);