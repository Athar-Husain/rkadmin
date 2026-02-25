import Chart from 'react-apexcharts';

const StaffStatusChart = ({ active, inactive }) => {
  return (
    <Chart
      type="donut"
      height={280}
      series={[active, inactive]}
      options={{
        labels: ['Active', 'Inactive'],
        colors: ['#4caf50', '#f44336'],
        legend: { position: 'bottom' },
        dataLabels: { enabled: true }
      }}
    />
  );
};

export default StaffStatusChart;
