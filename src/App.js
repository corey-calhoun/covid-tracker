
import React, { useState, useEffect } from 'react';
import './App.css';
import { sortData} from './util';

// Components
import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import InfoBox from './InfoBox/InfoBox';
import Map from './Map/Map'
import Table from './Table/Table'


function App() {

  const [ countries, setCountries ] = useState([]);
  const [ country, setCountry ] = useState("worldwide");
  const [ countryInfo, setCountryInfo ] = useState({});
  const [ tableData, setTableData ] = useState([]);

  //set inial worldwide stats
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
  .then(data => {
    setCountryInfo(data);
  })    
  }, [])

  //set individual stats
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {

        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2 
          }
        ));

        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
      });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/countries' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
     .then(response => response.json())
     .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
     })
  }


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
              <MenuItem value="worldwide">{country}</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        
        <div className="app__stats">
              <InfoBox title="Total Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
              <InfoBox title="Total Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
              <InfoBox title="Total Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>
        <div className="app__map">
          <Map />
        </div>
      </div>

      <Card className="app__right">
        <CardContent>
          <h3 className="app__table">Live Cases by Country</h3>
          <Table countries={tableData}/>
          <h3 className="app__graph">Worldwide New Cases</h3>
          {/* Graph */}
        </CardContent>
      </Card>
      
        
    </div>
  );
}

export default App;
