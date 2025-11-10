import { describe, it, expect } from 'vitest';
import {
  validateDNA,
  validateRNA,
  validateProtein,
  validateEmail,
  validateFileExtension,
} from './validators';

describe('validators', () => {
  describe('validateDNA', () => {
    it('should return true for valid DNA sequences', () => {
      expect(validateDNA('ATGC')).toBe(true);
      expect(validateDNA('atgc')).toBe(true);
      expect(validateDNA('ATGCATGC')).toBe(true);
      expect(validateDNA('ATG C')).toBe(true); // with spaces
    });

    it('should return false for invalid DNA sequences', () => {
      expect(validateDNA('ATGCU')).toBe(false); // U is RNA
      expect(validateDNA('ATGCX')).toBe(false); // X is invalid
      expect(validateDNA('123')).toBe(false);
    });

    it('should return true for empty string', () => {
      expect(validateDNA('')).toBe(true);
    });
  });

  describe('validateRNA', () => {
    it('should return true for valid RNA sequences', () => {
      expect(validateRNA('AUGC')).toBe(true);
      expect(validateRNA('augc')).toBe(true);
      expect(validateRNA('AUGCAUGC')).toBe(true);
      expect(validateRNA('AUG C')).toBe(true); // with spaces
    });

    it('should return false for invalid RNA sequences', () => {
      expect(validateRNA('ATGC')).toBe(false); // T is DNA
      expect(validateRNA('AUGCX')).toBe(false); // X is invalid
      expect(validateRNA('123')).toBe(false);
    });

    it('should return true for empty string', () => {
      expect(validateRNA('')).toBe(true);
    });
  });

  describe('validateProtein', () => {
    it('should return true for valid protein sequences', () => {
      expect(validateProtein('ACDEFGHIKLMNPQRSTVWY')).toBe(true);
      expect(validateProtein('acdefghiklmnpqrstvwy')).toBe(true);
      expect(validateProtein('ACDE FGHI')).toBe(true); // with spaces
    });

    it('should return false for invalid protein sequences', () => {
      expect(validateProtein('ACDEX')).toBe(false); // X is not standard
      expect(validateProtein('123')).toBe(false);
      expect(validateProtein('ACDE@')).toBe(false);
    });

    it('should return true for empty string', () => {
      expect(validateProtein('')).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('invalid@domain')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validateFileExtension', () => {
    it('should return true for allowed file extensions', () => {
      expect(validateFileExtension('file.fasta', ['.fasta', '.fa'])).toBe(true);
      expect(validateFileExtension('file.fa', ['.fasta', '.fa'])).toBe(true);
      expect(validateFileExtension('file.gb', ['.gb', '.gbk'])).toBe(true);
      expect(validateFileExtension('file.FASTA', ['.fasta', '.fa'])).toBe(true); // case insensitive
    });

    it('should return false for disallowed file extensions', () => {
      expect(validateFileExtension('file.txt', ['.fasta', '.fa'])).toBe(false);
      expect(validateFileExtension('file.pdf', ['.fasta', '.fa'])).toBe(false);
      expect(validateFileExtension('file', ['.fasta', '.fa'])).toBe(false);
    });
  });
});
