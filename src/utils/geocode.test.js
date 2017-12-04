import { geocode } from './geocode';

test('Geocode Orlando', async () => {
  const data = await geocode({ latitude: 28.538335, longitude: -81.379236 });
  expect(data).toBe('Orlando, USA');
});
test('Geocode Denver', async () => {
  const data = await geocode({ latitude: 39.739236, longitude: -104.990251 });
  expect(data).toBe('Denver, USA');
});
test('Geocode Bangkok', async () => {
  const data = await geocode({ latitude: 13.756331, longitude: 100.501765 });
  expect(data).toBe('Bangkok, TA');
});
test('Geocode Pacific Ocean', async () => {
  const data = await geocode({ latitude: 28.538335, longitude: -81.379236 });
  expect(data).toBe('Null');
});
test('Geocode Null Island', async () => {
  const data = await geocode({ latitude: 0, longitude: 0 });
  expect(data).toBe('Null');
});
