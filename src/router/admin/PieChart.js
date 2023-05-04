import React from 'react';
import { ResponsivePie } from '@nivo/pie';

const PieChart = ({ data }) => (
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
      modifiers: [['opacity', '2.5']],
    }}
    arcLinkLabel={function (e) {
      return e.id + ' (' + e.value + ')'
    }}
    arcLinkLabelsTextOffset={5}
    arcLinkLabelsTextColor="#000000"
    arcLinkLabelsStraightLength={16}
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: 'color', modifiers: [] }}
    arcLabelsTextColor={{
      from: 'color',
      modifiers: [['darker', '3']],
    }}
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
);

export default PieChart;
