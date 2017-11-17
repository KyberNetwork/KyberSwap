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
        expect(result).toBe(1234567);
    })
    it('number = -12345678', () => {
        let result = roundingNumber(-12345678);
        expect(result).toBe(0);
    })
    it('number = 00012345678', () => {
        let result = roundingNumber('00012345678');
        expect(result).toBe(1234567);
    })
    it('number = 12345678.0000000', () => {
        let result = roundingNumber(12345678.0000000);
        expect(result).toBe(1234567);
    })
    it('number = 1.2340000000', () => {
        let result = roundingNumber(1.2340000000);
        expect(result).toBe(1.234);
    })
    it('number = 12.234000008', () => {
        let result = roundingNumber(12.234000008);
        expect(result).toBe(12.234);
    })
    it('number = 1234567.1', () => {
        let result = roundingNumber(1234567.1);
        expect(result).toBe(1234567);
    })
})