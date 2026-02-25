import Chart from 'react-apexcharts';
import dayjs from 'dayjs';

const PurchaseSalesChart = ({ purchases }) => {
  const dailySales = {};

  purchases.forEach((p) => {
    const date = dayjs(p.createdAt).format('DD MMM');
    dailySales[date] = (dailySales[date] || 0) + (p.finalAmount || 0);
  });

  const categories = Object.keys(dailySales);
  const series = [
    {
      name: 'Sales',
      data: Object.values(dailySales)
    }
  ];

  return (
    <Chart
      type="area"
      height={300}
      series={series}
      options={{
        chart: { toolbar: { show: false } },
        xaxis: { categories },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' }
      }}
    />
  );
};

export default PurchaseSalesChart;
