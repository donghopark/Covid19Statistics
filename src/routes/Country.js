import React, { useEffect, useState } from 'react'
import { Chart } from "react-charts";
import { useParams } from "react-router-dom";
import moment from 'moment'
import '../App.css';

function Country() {
    const params = useParams();
    const country = params.country.toLowerCase().split(' ').join('-')
    const [totalDosesData, setTotalDosesData] = useState([]);
    const [dailyDosesdData, setDailyDosesdData] = useState([]);
    const [fullyVaccinatedData, setFullyVaccinatedData] = useState([]);
    const [covidCasesData, setCovidCasesData] = useState([]);
    const [covidDeathsData, setCovidDeathsData] = useState([]);
    const vaccinationDataURL = `https://graphics.thomsonreuters.com/data/2020/coronavirus/owid-covid-vaccinations/countries/${country}/data.json`
    const covidDataURL = `https://graphics.thomsonreuters.com/data/2020/coronavirus/global-tracker/countries/${country}/counts/all.json`

    useEffect(() => {
        fetch(vaccinationDataURL)
            .then(res => res.json())
            .then(async (result) => {
                setTotalDosesData(result.totalDoses)
                setDailyDosesdData(result.dailyDoses)
                setFullyVaccinatedData(result.peopleFullyVaccinated)
            }, (error) => {
                console.log(error)
            })

        fetch(covidDataURL)
            .then(res => res.json())
            .then(async (result) => {
                setCovidCasesData(result.cases)
                setCovidDeathsData(result.deaths)
            }, (error) => {
                console.log(error)
            })
    }, [params])

    const allDates = React.useMemo(() => fullyVaccinatedData.map(datum => datum.date).concat(totalDosesData.map(datum => datum.date)).concat(covidCasesData.map(datum => datum.date)).concat(covidDeathsData.map(datum => datum.date)).filter((value, index, self) => self.indexOf(value) == index).sort((a, b) => moment(a).isBefore(moment(b)) ? -1 : 1),
        [fullyVaccinatedData, totalDosesData, covidCasesData, covidDeathsData])


    const data = React.useMemo(
        () => [
            {
                label: 'Fully Vaccinated',
                data: fullyVaccinatedData.map((datum, index) => [allDates.indexOf(datum.date), datum.count / 10000]),
            },
            {
                label: 'Total Doses',
                data: totalDosesData.map((datum, index) => [allDates.indexOf(datum.date), datum.count / 10000]),
            },
            {
                label: 'Covid Cases',
                data: covidCasesData.map((datum, index) => [allDates.indexOf(datum.date), datum.count]),
            },
            {
                label: 'Deaths',
                data: covidDeathsData.map((datum, index) => [allDates.indexOf(datum.date), datum.count]),
            },
        ],
        [fullyVaccinatedData, totalDosesData, covidCasesData, covidDeathsData]
    )

    console.log(data)
    const axes = React.useMemo(
        () => [
            { primary: true, type: 'linear', position: 'bottom' },
            { type: 'linear', position: 'left' }
        ],
        []
    )

    if (!fullyVaccinatedData.length) return <></>
    return (
        <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%'
        }}>
            <Chart data={data} axes={axes} tooltip />
        </div>
    );
}

export default Country;
