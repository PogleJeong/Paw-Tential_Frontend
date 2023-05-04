import React from 'react';
import PieChart from './PieChart';

const MyComponent = () => {
  const data = [
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
  ];

  return (
    <div style={{ height: '400px' }}>
      <PieChart data={data} />
    </div>
  );
};

export default MyComponent;
