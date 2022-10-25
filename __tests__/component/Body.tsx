import React from 'react';
import { useVM } from '../../src/useVM';
import StoreViewModel from './../../src/';
import { GLOBAL_KEYS } from './types';

export default function Body() {
  const { useGlobalStore } = useVM(StoreViewModel, {});
  const [bodyData] = useGlobalStore(GLOBAL_KEYS.HEADER, {});
  const { count, randomData } = bodyData;
  console.log('body-Data', bodyData);
  return (
    <div style={{ border: '1px solid blue' }}>
      <div>
        <p>BODY : </p>
        <span>&nbsp;&nbsp;</span>
        <p>count: {count}</p>
        <p>You Click random data is: {JSON.stringify(randomData, null, 4)}</p>
      </div>
    </div>
  );
}
