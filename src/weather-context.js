import React, { useState, createContext } from 'react';

const WeatherContext = createContext();

const StateProvider = (props) => {
    const [location, setLocation] = useState([]);
    const [city, setCity] = useState([]);
    const [dayForecast, setDayForecast] = useState([])
    return (
        <WeatherContext.Provider value={{ location, setLocation, dayForecast, setDayForecast, city, setCity }}>
            {props.children}
        </WeatherContext.Provider>
    );
};

const withState = (Child) => (props) =>( 
    <WeatherContext.Consumer>
        {(context) => <Child {...props} {...context} />}
    </WeatherContext.Consumer>
);

export { StateProvider, withState };