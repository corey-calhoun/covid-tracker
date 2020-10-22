
import React, { useState, useEffect } from 'react';
import './App.css';
import { sortData, prettyPrintStat } from './util';
import numeral from 'numeral'
import 'leaflet/dist/leaflet.css'

// Components
import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import InfoBox from './InfoBox/InfoBox';
import Map from './Map/Map'
import Table from './Table/Table'
import Graph from './Graph/Graph';


function App() {

  const [ countries, setCountries ] = useState([]);
  const [ country, setCountry ] = useState("worldwide");
  const [ countryInfo, setCountryInfo ] = useState({});
  const [ tableData, setTableData ] = useState([]);
  const [ caseType, setCaseType ] = useState('cases');
  const [ mapCountries, setMapCountries ] = useState([]);
  const [ mapCenter, setMapCenter ] = useState({ lat: 34.80746, lng: -40.4796 });
  const [ mapZoom, setMapZoom] = useState(2);

  //set inial worldwide stats
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    }) ;   
  }, []);

  //set individual stats
  useEffect(() => {
    const getCountriesData = async () => {
      fetch ("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
              name: country.country,
              value: country.countryInfo.iso2 
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
      });
    };

    getCountriesData();
  }, []);

  console.table(caseType);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'worldwide' 
      ? 'https://disease.sh/v3/covid-19/countries' 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(2); 
     });
  };


  return (
    <div className="app">
      <div className="app__left">
          <div className="app__header">
          <h1>COVID-19 CASE TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select 
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        
        <div className="app__stats">
              <InfoBox 
               title="Coronavirus Cases" 
               isRed
               active={caseType === 'cases'}
               cases={countryInfo.todayCases} 
               total={numeral(countryInfo.cases).format("0.0a")}
               onClick={(e) => setCaseType("cases")}
              />
              <InfoBox 
               title="Recovered" 
               active={caseType === 'recovered'}
               cases={prettyPrintStat(countryInfo.todayRecovered)} 
               total={numeral(countryInfo.recovered).format("0.0a")}
               onClick={(e) => setCaseType("recovered")}
              />
              <InfoBox 
               title="Deaths" 
               isRed
               active={caseType === 'deaths'}
               cases={prettyPrintStat(countryInfo.todayDeaths)} 
               total={numeral(countryInfo.deaths).format("0.0a")}
               onClick={(e) => setCaseType("deaths")}
              />
        </div>
        <div className="app__map">
          <Map 
           countries={mapCountries}
           casesType={caseType}
           center={mapCenter}
           zoom={mapZoom}
          />
        </div>
      </div>

      <Card className="app__right">
        <CardContent className="app__table">
          <h3 className="app__table">Live Cases by Country</h3>
          <Table countries={tableData}/>
          <h3 className="app__graph">Worldwide new {caseType}</h3>
          <Graph caseType={caseType}/>
        </CardContent>
      </Card>
      
        
    </div>
  );
}

export default App;
