import React from 'react';
import PetChart from './PetChart';
import UserChart from './UserChart';
import RegiChart from './RegiChart';

import "../../styles/chart.css";

const Chart = () => {



  return (
    <div style={{ height: '400px' }}>
      <PetChart />
      <UserChart />
      <RegiChart />

    </div>
  );
};

export default Chart;
