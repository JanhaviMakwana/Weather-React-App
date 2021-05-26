import React, { useEffect, useState } from 'react';
import {instance,API_KEY} from '../axios';
import CanvasJSReact from '../assets/canvasjs.react';
import styles from './HourlyWeather.module.css';
import moment from 'moment';
import { withState } from '../weather-context';


/* const API_KEY = process.env.API_KEY; */

const convertTemp = (k) => {
    const C = k - 273.15
    return parseFloat(C).toFixed(2);
}

let lable1 = [];
let label2 = [];

const createLables = (hourly) => {
    console.log("Updating lable");
    lable1.length = 0;
    label2.length = 0;
    for (let i in hourly) {
        lable1.push({
            label: moment(new Date((hourly[i].dt) * 1000)).format('hh a'),
            y: Number(convertTemp(hourly[i].temp)),
            name: hourly[i].weather[0].description,
            toolTipContent: "{label}<br/>{name} : {y}℃  "
        });
        label2.push({
            label: hourly[i].weather[0].description,
            toolTipContent: '<img src={icon} alt="/>'
        });
    }
}

const HourlyWeather = (props) => {

    const [hourly, setHourly] = useState([]);
    const location = props.loc;
    const tem = '℃'
    const icon = require('../assets/icons/sunny.png').default;

    const fetchData = async () => {
        setHourly([])
        const res = await instance(`onecall?lat=${location.lat}&lon=${location.lon}&exclude=minutely,current&appid=${API_KEY}`);
        setHourly(res.data.hourly);
        createLables(res.data.hourly);
    }

    useEffect(() => {
        fetchData();
        const timer = setInterval(() => {
            fetchData();
        }, [500000]);
    }, [location]);

    return (
        <div className={styles.HourlyWeather}>
            {hourly.length !== 0 && <div>
                <CanvasJSReact.CanvasJSChart
                    className="chart-container"
                    options={{
                        theme: 'light2',
                        axisY: {
                            suffix: tem
                        },
                        axisX: {
                            interval: 2
                        },
                        toolTip: {
                            enabled: true,
                            fontSize: 18
                        },
                        axisX2: {
                            interval: 2
                        },
                        data: [{
                            dataPoints: lable1,
                            type: 'line',
                            axisXType: 'secondary'
                        },
                        {
                            dataPoints: label2,
                            type: 'line',
                            axisXType: 'primary'
                        }]
                    }
                    }
                />
            </div>}
        </div>
    );
};

export default withState(HourlyWeather);