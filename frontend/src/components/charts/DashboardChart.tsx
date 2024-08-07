import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { SearchBookingResponse } from '../../../../types/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type DashboardChartProps = {
    bookings: SearchBookingResponse;
};

const DashboardChart = ({ bookings }: DashboardChartProps) => {
    const labels = bookings.data.map(booking => new Date(booking.bookingDate).toLocaleDateString());
    const dataPoints = bookings.data.map(booking => booking.totalCost);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Total Cost',
                fill: false,
                lineTension: 0.5,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: dataPoints
            }
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Total Booking Cost per Date',
            },
            legend: {
                display: true,
            }
        },
    };

    return (
        <div>
            <Line data={chartData} options={options} />
        </div>
    );
}

export default DashboardChart;
