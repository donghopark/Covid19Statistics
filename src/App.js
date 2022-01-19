import { useEffect, useState } from 'react'
import { Space, Switch, Table, Tooltip } from 'antd';
import { Link } from "react-router-dom";
import ReactGA from 'react-ga';
import './App.css';

function App() {  
  const [latestPerPopData, setLatestPerPopData] = useState([]);
  const [oecdOnly, setOECDOnly] = useState(true);
  const POPULATION = 4000000
  const OECD = ['AUSTRALIA', 'AUSTRIA', 'BELGIUM', 'CANADA', 'CHILE', 'COLOMBIA', 'COSTA RICA', 'CZECH REPUBLIC', 'DENMARK', 'ESTONIA',
    'FINLAND', 'FRANCE', 'GERMANY', 'GREECE', 'HUNGARY', 'ICELAND', 'IRELAND', 'ISRAEL', 'ITALY', 'JAPAN', 'SOUTH KOREA',
    'LATVIA', 'LITHUANIA', 'LUXEMBOURG', 'MEXICO', 'NETHERLANDS', 'NEW ZEALAND', 'NORWAY', 'POLAND', 'PORTUGAL', 'SLOVAKIA',
    'SLOVENIA', 'SPAIN', 'SWEDEN', 'SWITZERLAND', 'TURKEY', 'UNITED KINGDOM', 'UNITED STATES']
  const latestPerPopDataURL = "https://graphics.thomsonreuters.com/data/2020/coronavirus/owid-covid-vaccinations/latest-perpop-data-all.json"
  const statisticsURL = "https://graphics.thomsonreuters.com/data/2020/coronavirus/global-tracker/statistics.json"
  // https://graphics.thomsonreuters.com/data/2020/coronavirus/owid-covid-vaccinations/latest-perpop-data-all.json
  // https://graphics.thomsonreuters.com/data/2020/coronavirus/global-tracker/countries/south-korea/counts/all.json
  // https://graphics.thomsonreuters.com/data/2020/coronavirus/owid-covid-vaccinations/countries/south-korea/data.json
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.hash);
  }, []);

  useEffect(() => {
    fetch(latestPerPopDataURL)
      .then(res => res.json())
      .then(async (latestPerPopResult) => {

        // setLatestPerPopData(latestPerPopResult)

        fetch(statisticsURL)
          .then(res => res.json())
          .then(async (statisticsResult) => {
            const withStatistics = latestPerPopResult.map(latestPerPopdatum => {
              const latestTotalCases = statisticsResult.latestTotals.cases[latestPerPopdatum.countryISO]
              const latestTotalDeaths = statisticsResult.latestTotals.deaths[latestPerPopdatum.countryISO]

              latestPerPopdatum['latestTotalCases'] = latestTotalCases
              latestPerPopdatum['latestTotalDeaths'] = latestTotalDeaths
              return latestPerPopdatum

            })

            setLatestPerPopData(withStatistics)
          }, (error) => {
            console.log(error)
          })

      }, (error) => {
        console.log(error)
      })
  }, [])

  const columns = [
    {
      title: <Space><div>Country</div><Tooltip title="OECD Only"><Switch defaultChecked={oecdOnly} onChange={(checked) => setOECDOnly(checked)}></Switch></Tooltip></Space>,
      width: 100,
      dataIndex: 'country',
      key: 'country',
      render: (value) => <Link to={`/country/${value}`}>{value}</Link>
    },
    {
      title: 'Population',
      width: 100,
      dataIndex: 'population',
      key: 'population',
      sorter: (a, b) => a.population - b.population,
      render: (value) => value?.toLocaleString()
    },
    {
      title: 'Fully Vaccinated',
      width: 100,
      dataIndex: 'peopleFullyVaccinated',
      key: 'peopleFullyVaccinated',
      sorter: (a, b) => a.peopleFullyVaccinated - b.peopleFullyVaccinated,
      // defaultSortOrder: "ascend",
      render: (value) => value?.toLocaleString()
    },
    {
      title: 'Fully Vaccinated(%)',
      width: 100,
      dataIndex: 'percentage',
      key: 'percentage',
      sorter: (a, b) => a.percentage - b.percentage,
      defaultSortOrder: "descend",
      render: (value) => value?.toLocaleString()
    },
    {
      title: 'Total Doses',
      width: 100,
      dataIndex: 'totalDoses',
      key: 'totalDoses',
      sorter: (a, b) => a.totalDoses - b.totalDoses,
      render: (value) => value?.toLocaleString()
    },

    {
      title: 'Total Cases',
      width: 100,
      dataIndex: 'latestTotalCases',
      key: 'latestTotalCases',
      sorter: (a, b) => a.latestTotalCases - b.latestTotalCases,
      render: (value) => value?.toLocaleString()
    },
    {
      title: 'Total Cases(%)',
      width: 100,
      dataIndex: 'latestTotalCases',
      key: 'latestTotalCasesPercentage',
      sorter: (a, b) => a.latestTotalCases / a.population - b.latestTotalCases / b.population,
      render: (value, record) => `${(value / record.population * 100).toLocaleString()}`
    },
    {
      title: 'Total Deaths',
      width: 100,
      dataIndex: 'latestTotalDeaths',
      key: 'latestTotalDeaths',
      sorter: (a, b) => a.latestTotalDeaths - b.latestTotalDeaths,
      render: (value) => value?.toLocaleString()
    },

    {
      title: 'Total Deaths(%)',
      width: 100,
      dataIndex: 'latestTotalDeaths',
      key: 'latestTotalDeathsPercentage',
      sorter: (a, b) => a.latestTotalDeaths / a.population - b.latestTotalDeaths / b.population,
      render: (value, record) => `${(value / record.population * 100).toLocaleString()}`
    },
    {
      title: 'Vaccines',
      width: 400,
      dataIndex: 'vaccineName',
      key: 'vaccineName'
    },
  ];

  const data = latestPerPopData.filter(row => !oecdOnly || OECD.some(oecd => oecd.toLocaleLowerCase() == row.country.toLocaleLowerCase())).filter(row => row.population > POPULATION).map(row => {
    return { ...row, key: row.country, percentage: row.peopleFullyVaccinated / row.population * 100 }
  })

  return (
    <div className="App">
      <Table sticky columns={columns} dataSource={data} scroll={{ x: 1500 }} pagination={false} size={'small'} showHeader={true} bordered={true} />
    </div>
  );
}

export default App;
