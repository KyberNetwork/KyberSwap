import { roundingNumber } from '../../src/js/utils/converter';

describe('roundingNumber function ', () => {
    it('number = "string"', () => {
        let result = roundingNumber('string');
        expect(result).toBe('0.000000');
    })
    it('number = undefined', () => {
        let result = roundingNumber(undefined);
        expect(result).toBe('0.000000');
    })
    it('number = 123', () => {
        let result = roundingNumber(123);
        expect(result).toBe('123.0000');
    })
    it('number = 12345678', () => {
        let result = roundingNumber(12345678);
        expect(result).toBe('12,345,678');
    })
    it('number = 12345678.3123', () => {
        let result = roundingNumber(12345678.3123);
        expect(result).toBe('12,345,678');
    })
    it('number = -12345678', () => {
        let result = roundingNumber(-12345678);
        expect(result).toBe('0.000000');
    })
    it('number = 00012345678', () => {
        let result = roundingNumber('00012345678');
        expect(result).toBe('12,345,678');
    })
    it('number = 123456789.0000000', () => {
        let result = roundingNumber(123456789.0000000);
        expect(result).toBe('123,456,789');
    })
    it('number = 1.2340000000', () => {
        let result = roundingNumber(1.2340000000);
        expect(result).toBe('1.234000');
    })
    it('number = 12.234000008', () => {
        let result = roundingNumber(12.234000008);
        expect(result).toBe('12.23400');
    })
    it('number = 1.2345678', () => {
        let result = roundingNumber(1.2345678);
        expect(result).toBe('1.234568');
    })
    it('number = 1.0000008', () => {
        let result = roundingNumber(1.0000008);
        expect(result).toBe('1.000001');
    })
    it('number = 1234567.1', () => {
        let result = roundingNumber(1234567.1);
        expect(result).toBe('1,234,567');
    })
    it('number = 12345.123', () => {
        let result = roundingNumber(12345.12);
        expect(result).toBe('12,345.12');
    })
    it('number = 0.0000000976077', () => {
        let result = roundingNumber(0.0000000976077);
        expect(result).toBe('0.000000');
    })
    it('number = 1e-8', () => {
        let result = roundingNumber(1e-8);
        expect(result).toBe('0.000000');
    })
    it('number = 0.9999999', () => {
        let result = roundingNumber(0.9999999);
        expect(result).toBe('1.00000');
    })
    it('number = 0.1234567', () => {
        let result = roundingNumber(0.1234567);
        expect(result).toBe('0.123457');
    })
    it('number = 0', () => {
        let result = roundingNumber(0);
        expect(result).toBe('0.000000');
    })
    it('number = 1.9999999', () => {
        let result = roundingNumber(1.9999999);
        expect(result).toBe('2.000000');
    })
    it('number = 0.0125678', () => {
        let result = roundingNumber(0.0125678);
        expect(result).toBe('0.012568');
    })
    it('number = 0.000125678', () => {
        let result = roundingNumber(0.000125678);
        expect(result).toBe('0.000126');
    })
})