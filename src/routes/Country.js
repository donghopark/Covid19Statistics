import React, { useEffect, useState } from 'react'
import { Chart } from "react-charts";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useParams } from "react-router-dom";
import moment from 'moment'
import '../App.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

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


    // const data = React.useMemo(
    //     () => [
    //         {
    //             label: 'Covid Cases',
    //             // secondaryAxisId: "3",
    //             data: covidCasesData.map((datum, index) => ({ date: moment(datum.date, 'YYYY-MM-DD').toDate(), count: datum.count })),
    //         },
    //         {
    //             label: 'Deaths',
    //             // secondaryAxisId: "3",
    //             data: covidDeathsData.map((datum, index) => ({ date: moment(datum.date, 'YYYY-MM-DD').toDate(), count: datum.count })),
    //         },
    //         {
    //             label: 'Fully Vaccinated',
    //             secondaryAxisId: "2",
    //             data: fullyVaccinatedData.map((datum, index) => ({ date: moment(datum.date, 'YYYY-MM-DD').toDate(), count: datum.count / 1000 })),
    //         },
    //         {
    //             label: 'Total Doses',
    //             secondaryAxisId: "2",
    //             data: totalDosesData.map((datum, index) => ({ date: moment(datum.date, 'YYYY-MM-DD').toDate(), count: datum.count / 1000 })),
    //         },
    //     ],
    //     [fullyVaccinatedData, totalDosesData, covidCasesData, covidDeathsData]
    // )
    // const primaryAxis = React.useMemo(
    //     () => ({
    //         type: 'timeLocal',
    //         getValue: datum => datum.date,
    //     }),
    //     []
    // )

    // const secondaryAxes = React.useMemo(
    //     () => [
    //         {
    //             type: 'linear',
    //             elementType: 'line',
    //             getValue: datum => datum.count,
    //         },
    //         {
    //             id: "2",
    //             type: 'linear',
    //             elementType: 'line',
    //             getValue: datum => datum.count,
    //         },
    //     ],
    //     []
    // )


    const allDates = covidCasesData.map(datum => datum.date).concat(covidDeathsData.map(datum => datum.date)).concat(fullyVaccinatedData.map(datum => datum.date)).concat(totalDosesData.map(datum => datum.date)).filter((value, index, self) => self.indexOf(value) == index)
    const labels = allDates.map(dateString => moment(dateString).format('YYYY-MMM-DD'))
    const data = React.useMemo(
        () => ({
            labels,
            datasets: [

                {
                    label: 'Covid Cases',
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    pointRadius: 1,
                    yAxisID: 'y',
                    data: allDates.map(date => {
                        const datum = covidCasesData.find(datum => datum.date == date)
                        if (datum) return datum.count
                        return undefined
                    })
                },
                {
                    label: 'Deaths',
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    pointRadius: 1,
                    yAxisID: 'y',
                    data: allDates.map(date => {
                        const datum = covidDeathsData.find(datum => datum.date == date)
                        if (datum) return datum.count
                        return undefined
                    })
                },
                {
                    label: 'Fully Vaccinated',
                    borderColor: 'rgb(53, 255, 235)',
                    backgroundColor: 'rgba(53, 255, 235, 0.5)',
                    pointRadius: 1,
                    yAxisID: 'y1',
                    data: allDates.map(date => {
                        const datum = fullyVaccinatedData.find(datum => datum.date == date)
                        if (datum) return datum.count
                        return undefined
                    })
                },
                {
                    label: 'Total Doses',
                    borderColor: 'rgb(53, 162, 111)',
                    backgroundColor: 'rgba(53, 162, 111, 0.5)',
                    pointRadius: 1,
                    yAxisID: 'y1',
                    data: allDates.map(date => {
                        const datum = totalDosesData.find(datum => datum.date == date)
                        if (datum) return datum.count
                        return undefined
                    })
                },
            ]
        }),
        [fullyVaccinatedData, totalDosesData, covidCasesData, covidDeathsData]
    )




    const options = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: `Covid-19 Statistics: ${params.country}`,
            },
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };


    return (
        <div style={{
            position: 'absolute',
            width: '95%',
            height: '95%'
        }}>
            {/* <Chart options={{ data, primaryAxis, secondaryAxes, }} /> */}
            <Line options={options} data={data} />
        </div>
    );
}

export default Country;
