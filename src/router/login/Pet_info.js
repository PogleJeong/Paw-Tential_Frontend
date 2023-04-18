import React, { useState } from 'react';

const petInfo = ["dog", "cat"];

function Pet_info(){
  const [ selected, setSelected ] = useState("");

  const selectPet = (event) => {
    console.log(event.target.key);
    setSelected(event.target.key);
  }
  return (
    <div>
      <h1>반려동물 유무 선택 페이지</h1>
      <div className="selectBox">
        {petInfo.map((pet, key)=> (<div className='pet' key={key} onDoubleClick={selectPet}>{pet}</div>))}
      </div>
    </div>
  )
}

export default Pet_info;