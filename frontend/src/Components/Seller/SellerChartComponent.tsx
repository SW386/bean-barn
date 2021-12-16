import Paper from '@material-ui/core/Paper';
import { Chart } from "react-google-charts";

import './SellerChartComponent.css'

const SellerChartComponent = ({ popularItems }) => {
  return (
    <Paper className="chartContainer">
              {(popularItems)?
                <Chart
                  width={'100%'}
                  height={'100%'}
                  chartType="BarChart"
                  loader={<div>Loading chart..</div>}
                  data={popularItems}
                  options={{
                      title: 'Most popular products',
                      chartArea: { width: '70%', height: '70%' },
                      hAxis: {
                          title: 'Quantity sold',
                          minValue: 0
                      },
                      legend: { position: 'none' }
                  }}
                /> :
                <div>Fetching most popular items...</div>
              }
          </Paper>
  )
}

export default SellerChartComponent;