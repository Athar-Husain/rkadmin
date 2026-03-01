import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material';

const StaffStatusChart = ({ active, inactive }) => {
  const theme = useTheme();

  const options = {
    labels: ['Active', 'Inactive'],
    colors: [theme.palette.success.main, theme.palette.error.light],
    chart: {
      fontFamily: theme.typography.fontFamily
    },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              fontWeight: 600,
              color: theme.palette.text.secondary,
              formatter: () => active + inactive
            }
          }
        }
      }
    },
    legend: {
      position: 'bottom',
      fontSize: '13px',
      markers: { radius: 12 }
    },
    dataLabels: { enabled: false }, // Cleaner look for donuts
    tooltip: { y: { formatter: (val) => `${val} Members` } }
  };

  return <Chart type="donut" height={300} series={[active, inactive]} options={options} />;
};

export default StaffStatusChart;
