const { checkStock } = require('../src/inventoryService');
const { processPayment } = require('../src/paymentService');
const { createOrder } = require('../src/orderService');

describe('servicios instrumentados con OpenTelemetry', () => {
  afterEach(() => jest.restoreAllMocks());

  test('checkStock devuelve true cuando hay stock', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(checkStock('sku-1')).toBe(true);
  });

  test('checkStock devuelve false sin stock', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.05);
    expect(checkStock('sku-1')).toBe(false);
  });

  test('processPayment aprueba y rechaza segun el azar simulado', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(processPayment('A1', 10)).toBe(true);
    Math.random.mockReturnValue(0.01);
    expect(processPayment('A1', 10)).toBe(false);
  });

  test('createOrder completa la orden', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(createOrder('A1', 'sku-1', 10)).toEqual({ success: true });
  });

  test('createOrder rechaza por falta de stock', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.05);
    expect(createOrder('A2', 'sku-1', 10)).toEqual({ success: false, reason: 'sin stock' });
  });

  test('createOrder rechaza por pago', () => {
    jest.spyOn(Math, 'random').mockReturnValueOnce(0.5).mockReturnValueOnce(0.01);
    expect(createOrder('A3', 'sku-1', 10)).toEqual({ success: false, reason: 'pago rechazado' });
  });
});
