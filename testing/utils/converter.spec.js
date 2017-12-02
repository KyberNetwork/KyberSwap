import { roundingNumber } from '../../src/js/utils/converter';

describe('roundingNumber function ', () => {
    it('number = "string"', () => {
        let result = roundingNumber('string');
        expect(result).toBe(0);
    })
    it('number = undefined', () => {
        let result = roundingNumber(undefined);
        expect(result).toBe(0);
    })
    it('number = 123', () => {
        let result = roundingNumber(123);
        expect(result).toBe(123);
    })
    it('number = 12345678', () => {
        let result = roundingNumber(12345678);
        expect(result).toBe(12345678);
    })
    it('number = -12345678', () => {
        let result = roundingNumber(-12345678);
        expect(result).toBe(0);
    })
    it('number = 00012345678', () => {
        let result = roundingNumber('00012345678');
        expect(result).toBe(12345678);
    })
    it('number = 123456789.0000000', () => {
        let result = roundingNumber(123456789.0000000);
        expect(result).toBe(123456789);
    })
    it('number = 1.2340000000', () => {
        let result = roundingNumber(1.2340000000);
        expect(result).toBe(1.234);
    })
    it('number = 12.234000008', () => {
        let result = roundingNumber(12.234000008);
        expect(result).toBe(12.234);
    })
    it('number = 1.2345678', () => {
        let result = roundingNumber(1.2345678);
        expect(result).toBe(1.234568);
    })
    it('number = 1.0000008', () => {
        let result = roundingNumber(1.0000008);
        expect(result).toBe(1.000001);
    })
    it('number = 1234567.1', () => {
        let result = roundingNumber(1234567.1);
        expect(result).toBe(1234567);
    })
    it('number = 0.0000000976077', () => {
        let result = roundingNumber(0.0000000976077);
        expect(result).toBe(0);
    })
    it('number = 1e-8', () => {
        let result = roundingNumber(1e-8);
        expect(result).toBe(0);
    })
    it('number = 0.9999999', () => {
        let result = roundingNumber(0.9999999);
        expect(result).toBe(1);
    })
    it('number = 1.9999999', () => {
        let result = roundingNumber(1.9999999);
        expect(result).toBe(2);
    })
})