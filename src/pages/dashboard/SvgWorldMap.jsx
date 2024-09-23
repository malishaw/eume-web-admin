import React from 'react';
import WorldMap from 'react-svg-worldmap';
import { Box, Typography } from '@mui/material';
import { getCode } from 'country-list'; // Importing getCode from country-list
import { height, width } from '@mui/system';
// import { useTranslation } from 'react-i18next';

// This function will convert country names to ISO codes
const countryMap = {
    "España": "ES",
    "Spain": "ES",
    "United Kingdom": "GB",
    "Reino Unido": "GB",
    "Alemania": "DE",
    "Germany": "DE",
    "Portugal": "PT",
    "Italia": "IT",
    "Italy": "IT",
    "Brasil": "BR",
    "Brazil": "BR",
    "Andorra": "AD",
    "Estados Unidos": "US",
    "United States": "US",
    "Francia": "FR",
    "France": "FR",
    "Polonia": "PL",
    "Poland": "PL",
    "Japón": "JP",
    "Japan": "JP",
    "Colombia": "CO",
    "Uruguay": "UY"
};

const getCountryCode = (countryName) => {
    // const { t, i18n } = useTranslation();
    // Use country-list to get ISO code; fallback to the original name if not found
    const isoCode = getCode(countryName);

    if (!isoCode) {
        return countryMap[countryName] || countryName
    }

    // Fallback if getCode does not find a match; return the original name
    return isoCode || countryName;
};

const SVGWorldMap = ({ countryCounts }) => {
    // Convert countryCounts object to the format expected by react-svg-worldmap
    const data = countryCounts.map(([country, count]) => ({
        country: getCountryCode(country),
        value: count,
    }));

    console.log('country count data', data);

    // return (
    //     <Box sx={{ width: '100%', height: '100%', position: 'relative' }}
    //         direction="column"
    //         alignItems="center"
    //         justifyContent="center">
    //         <WorldMap
    //             color="green"
    //             // valueSuffix={t("people")}
    //             size="xl"
    //             data={data}
    //         />
    //     </Box>
    // );
    // return (
    //     <Box
    //         sx={{
    //             width: '100%',
    //             display: 'flex',
    //             alignItems: 'center',
    //             justifyContent: 'center', // Centers the content horizontally and vertically
    //             position: 'relative',
    //         }}
    //     >
    //         <WorldMap
    //             color="green"
    //             valueSuffix="people"
    //             size="xxl" // Increase the size of the world map (can be xl, xxl, or a specific numeric size)
    //             data={data}
    //         />
    //     </Box>
    // );

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}
        >
            <WorldMap
                color="green"
                // valueSuffix="people"
                size={'xl'}
                data={data}
            />
        </Box>
    );

};

export default SVGWorldMap;
