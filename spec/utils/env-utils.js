/*global describe, it, expect, require */

var envUtils = require('../lib/utils/env-utils');

describe('envUtils', () => {
  it('should be an object', () => {
    expect(typeof envUtils).toBe('object');
  });
  describe('encode', () => {
    it('should be a function', () => {
      expect(typeof envUtils.encode).toBe('function');
    });
    it('should encode a string', () => {
      expect(envUtils.encode('')).toBe('');
      expect(envUtils.encode('a')).toBe('YQ==');
      expect(envUtils.encode('Claudia Bot Builder')).toBe('Q2xhdWRpYSBCb3QgQnVpbGRlcg==');
      expect(envUtils.encode(`abc123!?$*&()'-=@~`)).toBe('YWJjMTIzIT8kKiYoKSctPUB-');
    });
  });
  describe('decode', () => {
    it('should be a function', () => {
      expect(typeof envUtils.decode).toBe('function');
    });
    it('should decode the string', () => {
      expect(envUtils.decode('')).toBe('');
      expect(envUtils.decode('YQ==')).toBe('a');
      expect(envUtils.decode('Q2xhdWRpYSBCb3QgQnVpbGRlcg==')).toBe('Claudia Bot Builder');
      expect(envUtils.decode('YWJjMTIzIT8kKiYoKSctPUB-')).toBe(`abc123!?$*&()'-=@~`);
    });
  });
});
