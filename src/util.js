import React from 'react'
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";


const caseTypeColors = {
    cases: {
        hex: "#CC1034",
        rgb: "rgb(204, 16, 52",
        half_op: "rgba(204, 16, 52, 0.5",
        multiplier: 800,
    },
    recovered: {
        hex: "#7DD71d",
        rgb: "rgb(125, 215, 29)",
        half_op: "rgba(125, 215, 29, 0.5)",
        multiplier: 1200,
    },
    deaths: {
        hex: "#fb4443",
        rgb: "rgb(251, 68, 67)",
        half_op: "rgba(251, 68, 67, 0.5)",
        multiplier: 2000,
    },
};


export const sortData = (data) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1)) 
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

  export const showDataOnMap = (data, caseType = 'cases') => 
    data.map((country) => (
        <Circle
          center={[country.countryInfo.lat, country.countryInfo.long]}
          color={caseTypeColors[caseType].hex}
          fillColor={caseTypeColors[caseType].hex}
          fillOpacity={0.5}
          radius={
              Math.sqrt(country[caseType]) * caseTypeColors[caseType].multiplier
          }
        >
            <Popup>
                <div className="info__container">
                    <div 
                      className="info-flag"
                      style={{ backgroundImage: `url(${country.countryInfo.flag})`}}   
                    ></div>
                    <div className="info-name">{country.country}</div>
                    <div className="ino-confirmed">
                        Cases: {numeral(country.cases).format("0,0")}
                    </div>
                    <div className="ino-confirmed">
                        Recovered: {numeral(country.recovered).format("0,0")}
                    </div>
                    <div className="ino-confirmed">
                        Deaths: {numeral(country.deaths).format("0,0")}
                    </div>
                </div>
            </Popup>
        </Circle>
    ))
