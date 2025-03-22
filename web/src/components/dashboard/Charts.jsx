import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Charts = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      // Create new chart instance
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [
            {
              label: 'Users',
              data: [65, 70, 80, 81, 90, 95, 110],
              borderColor: '#36A2EB',
              tension: 0.4,
              borderWidth: 2,
            },
            {
              label: 'Revenue',
              data: [30, 40, 45, 50, 55, 60, 70],
              borderColor: '#4BC0C0',
              tension: 0.4,
              borderWidth: 2,
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: '#999'
              }
            }
          },
          backgroundColor: 'transparent'
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="h-full">
      <h2 className="text-xl font-bold text-gray-800 p-4 border-b border-gray-200">CHARTS</h2>
      <div className="p-4 h-64">
        <canvas ref={chartRef} className="w-full h-full"></canvas>
      </div>
    </div>
  );
};

export default Charts;