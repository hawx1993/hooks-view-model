import React from 'react';
import { HeaderViewModel } from './Header.ViewModel';
import { useVM } from '../../../src/useVM';
import { GLOBAL_KEYS } from '../types';

export default function Header() {
  const {
    updateCount,
    changeData,
    changeHeaderData,
    useGlobalStore,
    useCurrentStore,
  } = useVM(HeaderViewModel, {});
  const [data] = useGlobalStore(GLOBAL_KEYS.HEADER, { count: 0 });
  const [headerData] = useCurrentStore({ headCount: 0 });
  const { count, randomData } = data;
  const { headCount } = headerData;
  console.log('Header-data', data, headerData);
  return (
    <div style={{ border: '2px solid green' }}>
      <p>Header:</p>
      <p>You clicked {count} times</p>
      <p>You Click random data is: {JSON.stringify(randomData, null, 4)}</p>
      <p>headerData: {headCount}</p>
      <button onClick={() => updateCount(count + 1)}>Click me</button>
      <button onClick={changeData}>change data</button>
      <button onClick={() => changeHeaderData(headCount + 2)}>
        only update header data
      </button>
    </div>
  );
}
