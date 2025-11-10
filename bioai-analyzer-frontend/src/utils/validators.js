// Sequence validation functions
export const validateDNA = (sequence) => {
  const dnaPattern = /^[ATGC\s]*$/i;
  return dnaPattern.test(sequence);
};

export const validateRNA = (sequence) => {
  const rnaPattern = /^[AUGC\s]*$/i;
  return rnaPattern.test(sequence);
};

export const validateProtein = (sequence) => {
  // Standard amino acid codes
  const proteinPattern = /^[ACDEFGHIKLMNPQRSTVWY\s]*$/i;
  return proteinPattern.test(sequence);
};

export const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const validateFileExtension = (filename, allowedExtensions) => {
  const extension = filename.split('.').pop().toLowerCase();
  return allowedExtensions.includes(`.${extension}`);
};
