import React, { useState, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';

import AdminSidebar from "../../component/AdminSidebar";


import "../../styles/chart.css";

const PetChart = () => {
  const [data, setData] = useState([
    {
      id: '강아지',
      label: 'Javascript',
      value: 35,
      color: 'hsl(131, 70%, 50%)',
    },
    {
      id: '고양이',
      label: 'Python',
      value: 25,
      color: 'hsl(131, 70%, 50%)',
    },
    {
      id: '관상어',
      label: 'Java',
      value: 20,
      color: 'hsl(131, 70%, 50%)',
    },
    {
      id: '햄스터',
      label: 'PHP',
      value: 10,
      color: 'hsl(131, 70%, 50%)',
    },
    {
      id: '기타',
      label: 'Other',
      value: 10,
      color: 'hsl(131, 70%, 50%)',
    },
  ]);

 



  return (

    <div className="admin-page">
    <div className="admin-page-sidebar">
      <AdminSidebar />
    </div>
    <div className="chart-container">
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
