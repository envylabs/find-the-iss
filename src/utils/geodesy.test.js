import {
  latToRadius,
  radiansToNorthPole,
} from './geodesy';

/* latToRadius */

test('WGS84 radius at Equator', () => expect(latToRadius(0)).toBeCloseTo(6378.137, 3));
test('WGS84 radius at North Pole', () => expect(latToRadius(90)).toBeCloseTo(6356.7523142, 3));
test('WGS84 radius at South Pole', () => expect(latToRadius(-90)).toBeCloseTo(6356.7523142, 3));
test('WGS84 radius at 45° N', () => expect(latToRadius(45)).toBeCloseTo(6367.49, 3));

/* radiansToNorthPole */

const radian = Math.PI;

test('Rotate from (0, 0)', () =>
  expect(radiansToNorthPole({ latitude: 0, longitude: 0 }))
    .toEqual({
      x: -0.5 * radian,
      y: -0.5 * radian,
      z: 0,
    }));
test('Rotate from (-90, 0)', () =>
  expect(radiansToNorthPole({ latitude: -90, longitude: 0 }))
    .toEqual({
      x: -radian,
      y: -0.5 * radian,
      z: 0,
    }));
test('Rotate from (0, 90)', () =>
  expect(radiansToNorthPole({ latitude: 0, longitude: 90 }))
    .toEqual({
      x: -0.5 * radian,
      y: -radian,
      z: 0,
    }));

test('Rotate from (45, 45)', () =>
  expect(radiansToNorthPole({ latitude: 45, longitude: 45 }))
    .toEqual({
      x: -0.25 * radian,
      y: -0.75 * radian,
      z: 0,
    }));

