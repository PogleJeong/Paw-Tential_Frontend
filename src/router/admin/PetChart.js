import React, { useState, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';
import axios from 'axios';

import AdminSidebar from "../../component/AdminSidebar";

const PetChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/petChart");
        const chartData = response.data.map(item => ({
          id: item.cate,
          label: item.cate,
          value: item.count,
          color: 'hsl(131, 70%, 50%)',
        }));
        setData(chartData);
      } catch (error) {
        console.log("Error fetching pet chart data:", error);
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
        <h2 className="chart-title">펫 차트</h2>
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          sortByValue={true}
          innerRadius={0.2}
          fit={false}
          activeInnerRadiusOffset={16}
          activeOuterRadiusOffset={16}
          colors={{ scheme: 'pastel1' }}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [['opacity', '0.2']],
          }}
          arcLinkLabel={(e) => `${e.id} (${e.value})`}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsLinkStrokeWidth={2}
          arcLinkLabelsLinkColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          legends={[
            {
              anchor: 'bottom-left',
              direction: 'column',
              justify: false,
              translateX: -60,
              translateY: 41,
              itemsSpacing: 1,
              itemWidth: 52,
              itemHeight: 14,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 14,
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
};

export default PetChart;
