import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import axios from 'axios';

import AdminSidebar from "../../component/AdminSidebar";

const UserChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/userChart");
        const formattedData = response.data.reduce((result, item) => {
          const ageGroup = item.age_group;
          const gender = item.gender === 1 ? '남성' : '여성';

          if (!result[ageGroup]) {
            result[ageGroup] = { age_group: ageGroup };
          }
          result[ageGroup][gender] = item.count;

          return result;
        }, {});
        const chartData = Object.values(formattedData);
        setData(chartData);
      } catch (error) {
        console.log("Error fetching user chart data:", error);
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
        <h2 className="chart-title">유저 차트</h2>
        <ResponsiveBar
          data={data}
          keys={['남성', '여성']}
          indexBy="age_group"
          groupMode="grouped"
          colors={{ scheme: 'pastel1' }}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          }}
          legends={[
            {
              anchor: 'top',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: -40,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemTextColor: '#999',
              symbolSize: 12,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000',
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}

export default UserChart;
