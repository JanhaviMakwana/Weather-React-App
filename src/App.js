import './App.css';
import Home from './Home/Home';
import { Switch, Route } from 'react-router-dom';
import ForecastDay from './ForecastDay/ForecastDay';
import { StateProvider } from './weather-context';

function App() {
  return (
    <div className="App">
      <StateProvider>
        <Switch>
          <Route path="/day" exact component={ForecastDay} />
          <Route path="/" exact component={Home} />
        </Switch>
      </StateProvider>
    </div>
  );
}

export default App;
