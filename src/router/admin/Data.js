import React from 'react';
import PetChart from './PetChart';
import UserChart from './UserChart';

const Chart = () => {

  const petData = [
    // ... pet data
  ];

  const userData = [
    // ... user data
  ];

  return (
    <div style={{ height: '400px' }}>
      <PetChart data={petData} />
      <UserChart data={userData} />
    </div>
  );
};

export default Chart;
