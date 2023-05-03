import React, { useState } from 'react';

function SearchFilter() {
  const [filters, setFilters] = useState({ filter1: false, filter2: false, filter3: false });

  function handleFilterChange(event) {
    const { name, checked } = event.target;
    setFilters({ ...filters, [name]: checked });
  }
  
  function handleSubmit(event) {
    event.preventDefault();
    const selectedFilters = Object.entries(filters)
                                 .filter(([_, checked]) => checked)
                                 .map(([name, _]) => name);
    // 선택된 필터 값들을 서버로 전송합니다.
  }
  console.log(filters);
  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>검색 필터</legend>

        <div>
          <input type="checkbox" id="filter1" name="filter1" checked={filters.filter1} onChange={handleFilterChange} />
          <label htmlFor="filter1">필터 1</label>
        </div>

        <div>
          <input type="checkbox" id="filter2" name="filter2" checked={filters.filter2} onChange={handleFilterChange} />
          <label htmlFor="filter2">필터 2</label>
        </div>

        <div>
          <input type="checkbox" id="filter3" name="filter3" checked={filters.filter3} onChange={handleFilterChange} />
          <label htmlFor="filter3">필터 3</label>
        </div>
      </fieldset>

      <button type="submit">검색</button>
    </form>
  );
}

export default React.memo(SearchFilter);