import { renderHook, act } from '@testing-library/react-hooks';
import Header from './component/Header';
import Footer from './component/Footer';
import Body from './component/Body';
import { COMPLEX_DATA } from './component/constants';
jest.mock('nanoid');

test('when call updateHeaderCount,globalHeaderData should return correct value', () => {
  const { result } = renderHook(() => Header());

  act(() => {
    result.current.updateHeaderCount();
  });

  expect(result.current.globalHeaderData).toMatchObject({ count: 1 });
  act(() => {
    result.current.updateHeaderCount();
  });
  expect(result.current.globalHeaderData).toMatchObject({ count: 2 });
  const { result: bodyResult } = renderHook(() => Body());
  expect(bodyResult.current.bodyCount).toBe(2);
});

test('when call changeOnlyHeaderData,currentHeaderData should return correct value', () => {
  const { result } = renderHook(() => Header());
  act(() => {
    result.current.changeOnlyHeaderData();
  });
  expect(result.current.currentHeaderData).toMatchObject({ headCount: 2 });
});

test('when call changeData, complexData should return correct value', () => {
  const { result } = renderHook(() => Header());
  act(() => {
    result.current.changeData();
  });
  expect(result.current.complexData).toMatchObject(COMPLEX_DATA);

  const { result: bodyResult } = renderHook(() => Body());
  expect(bodyResult.current.complexData).toMatchObject(COMPLEX_DATA);
});

test('when call incrementFooterCount, should only update footerData', () => {
  const { result } = renderHook(() => Footer());
  act(() => {
    result.current.incrementFooterCount();
  });
  expect(result.current.count).toBe(1);
});
