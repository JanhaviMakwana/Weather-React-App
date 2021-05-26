import React, { useState, useEffect } from 'react';
import { withState } from '../weather-context';
import icons from '../assets/icons.json';
import Wind from '../wind';
import styles from './CurrentWeather.module.css';
import moment from 'moment';

const convertTemp = (k) => {
    const C = k - 273.15
    return parseFloat(C).toFixed(2);
}

const CurrentWeather = (props) => {
    const [current, setCurrent] = useState([]);
    props.setLocation(props.currentWeather.coord);

     useEffect(() => {
         setCurrent(props.currentWeather);
         const timer = setTimeout(() => {
             setCurrent(props.currentWeather);
         }, [5000])
     }, [props.currentWeather])
  
    const iconType = current.length !== 0 && icons.icons.find(x => x.label === current.weather[0].description)
    const icon = current.length !== 0 ? require(`../assets/icons/${iconType.icon}.png`).default : '';
    const pressureIcon = require('../assets/gauge.png').default;
    const sagittarius = require('../assets/sagittarius.png').default;

    return (
        current.length !== 0 && <div className={styles.CurrentWeather}>
            <div className={styles.Header}>
                <p className={"m-0 " + styles.Date}>{moment(new Date((current.dt) * 1000)).format('LLL')}</p>
                <p className="m-0 h4 w-50 text-dark">{current.name},{current.sys.country}</p>
            </div>
            <div className={styles.Temperature + " " + "d-flex flex-row"}>
                <img src={icon} alt="temp" />
                <p className="h4"> {convertTemp(current.main.temp)}&deg;C</p>
            </div>
            <div className={styles.Description}>
                <p className="w-100">
                    Feels like {convertTemp(current.main.feels_like)}&deg;C.{" "}{current.weather[0].description}
                </p>
            </div>
            <div className="d-flex flex-row flex-wrap">
                <div className={styles.Pressure}>
                    <img src={pressureIcon} alt="compass" />
                    {current.main.pressure}Pa
                </div>
                <div className={styles.Humidity}>
                    <p>Humidity: {" " + current.main.humidity}&#37;</p>
                </div>
                <div className={styles.Wind}>
                    <img src={sagittarius} alt="sagittarius" />
                    {current.wind.speed}mph{" "}
                    {Wind.getDirection(current.wind.deg)}
                </div>
                <div className={styles.Visibility}>
                    <p>Visibility: {((current.visibility) / 1000).toFixed(1)}km</p>
                </div>
            </div>
        </div>
    );
};

export default withState(CurrentWeather);