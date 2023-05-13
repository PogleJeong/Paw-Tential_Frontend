import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import axios from 'axios';

import AdminSidebar from "../../component/AdminSidebar";

const RegiChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/regiChart");
        const formattedData = response.data.map(item => ({
          x: new Date(item.regiDate),
          y: item.count
        }));
        setData([{ id: 'Count', data: formattedData }]);
        console.log(formattedData);
      } catch (error) {
        console.log("Error fetching registration chart data:", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-sidebar">
        <AdminSidebar />
      </div>
      <div className="chart-container">
        <h2 className="chart-title">날짜 별 가입</h2>      
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 80, bottom: 80, left: 80 }}
          xScale={{ type: 'time', format: '%Y-%m-%d', precision: 'day' }}
          xFormat="time:%Y-%m-%d"
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false,
            tickValues: 5, 
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            format: '%b %d',
            tickValues: 'every 1 day',
            legend: 'Date',
            legendOffset: 36,
            legendPosition: 'middle'
          }}
          axisLeft={{
            legend: 'Count',
            legendOffset: -40,
            legendPosition: 'middle'
          }}
          curve="monotoneX"
          enableGridX={false}
          enableGridY={true}
          colors={{ scheme: 'category10' }}
          lineWidth={3}
          pointSize={6}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={3}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel="y"
          pointLabelYOffset={-12}
          useMesh={true}
        />
      </div>
    </div>
  );
};

export default RegiChart;
