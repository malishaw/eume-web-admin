import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Box, Typography } from '@mui/material';

const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

const WorldMap = ({ countryCounts }) => {
    const maxCount = Math.max(...Object.values(countryCounts));
    const minCount = Math.min(...Object.values(countryCounts));

    const colorScale = scaleLinear()
        .domain([minCount, maxCount])
        .range(['#CFD8DC', '#0277BD']);

    return (
        <Box sx={{ width: '100%', height: 400, position: 'relative' }}>
            <ComposableMap projection="geoMercator">
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const count = countryCounts[geo.properties.name] || 0;
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={count > 0 ? colorScale(count) : '#ECEFF1'}
                                    stroke="#607D8B"
                                    strokeWidth={0.5}
                                />
                            );
                        })
                    }
                </Geographies>
                {Object.entries(countryCounts).map(([country, count]) => {
                    const position = findCountryPosition(country);
                    if (position) {
                        return (
                            <Marker key={country} coordinates={position}>
                                <circle r={4} fill="#F44336" />
                                <text
                                    textAnchor="middle"
                                    y={-10}
                                    style={{ fontFamily: 'system-ui', fill: '#000', fontSize: '8px' }}
                                >
                                    {`${country}: ${count}`}
                                </text>
                            </Marker>
                        );
                    }
                    return null;
                })}
            </ComposableMap>
        </Box>
    );
};

// This function should return [longitude, latitude] for a given country
// You would need to implement this with a proper geocoding service or a predefined list of coordinates
const findCountryPosition = (country) => {
    // Placeholder implementation
    const positions = {
        'United States': [-98, 39],
        'China': [104, 35],
        // Add more countries as needed
    };
    return positions[country];
};

export default WorldMap;