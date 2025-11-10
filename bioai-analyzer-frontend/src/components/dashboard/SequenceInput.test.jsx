import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SequenceInput from './SequenceInput';

describe('SequenceInput', () => {
  const mockOnChange = vi.fn();
  const mockOnSubmit = vi.fn();

  it('should render textarea with correct placeholder', () => {
    render(
      <SequenceInput
        value=""
        onChange={mockOnChange}
        sequenceType="DNA"
        onSubmit={mockOnSubmit}
      />
    );

    const textarea = screen.getByPlaceholderText('Enter DNA sequence here...');
    expect(textarea).toBeInTheDocument();
  });

  it('should display character count', () => {
    render(
      <SequenceInput
        value="ATGC"
        onChange={mockOnChange}
        sequenceType="DNA"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Characters: 4')).toBeInTheDocument();
  });

  it('should call onChange when user types', () => {
    render(
      <SequenceInput
        value=""
        onChange={mockOnChange}
        sequenceType="DNA"
        onSubmit={mockOnSubmit}
      />
    );

    const textarea = screen.getByPlaceholderText('Enter DNA sequence here...');
    fireEvent.change(textarea, { target: { value: 'ATGC' } });

    expect(mockOnChange).toHaveBeenCalledWith('ATGC');
  });

  it('should show error for invalid DNA characters', () => {
    const { rerender } = render(
      <SequenceInput
        value=""
        onChange={mockOnChange}
        sequenceType="DNA"
        onSubmit={mockOnSubmit}
      />
    );

    // Update with invalid sequence
    rerender(
      <SequenceInput
        value="ATGCX"
        onChange={mockOnChange}
        sequenceType="DNA"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText(/Invalid characters detected/)).toBeInTheDocument();
    expect(screen.getByText(/A, T, G, C/)).toBeInTheDocument();
  });

  it('should show error for invalid RNA characters', () => {
    const { rerender } = render(
      <SequenceInput
        value=""
        onChange={mockOnChange}
        sequenceType="RNA"
        onSubmit={mockOnSubmit}
      />
    );

    // Update with invalid sequence (T is DNA, not RNA)
    rerender(
      <SequenceInput
        value="ATGC"
        onChange={mockOnChange}
        sequenceType="RNA"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText(/Invalid characters detected/)).toBeInTheDocument();
    expect(screen.getByText(/A, U, G, C/)).toBeInTheDocument();
  });

  it('should not show error for valid DNA sequence', () => {
    render(
      <SequenceInput
        value="ATGC"
        onChange={mockOnChange}
        sequenceType="DNA"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.queryByText(/Invalid characters detected/)).not.toBeInTheDocument();
  });

  it('should handle spaces in sequence', () => {
    render(
      <SequenceInput
        value="ATG C"
        onChange={mockOnChange}
        sequenceType="DNA"
        onSubmit={mockOnSubmit}
      />
    );

    // Character count should exclude spaces
    expect(screen.getByText('Characters: 4')).toBeInTheDocument();
    expect(screen.queryByText(/Invalid characters detected/)).not.toBeInTheDocument();
  });

  it('should call onSubmit when Ctrl+Enter is pressed', () => {
    render(
      <SequenceInput
        value="ATGC"
        onChange={mockOnChange}
        sequenceType="DNA"
        onSubmit={mockOnSubmit}
      />
    );

    const textarea = screen.getByPlaceholderText('Enter DNA sequence here...');
    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should not call onSubmit when only Enter is pressed without Ctrl', () => {
    const mockOnSubmitLocal = vi.fn();
    render(
      <SequenceInput
        value="ATGC"
        onChange={mockOnChange}
        sequenceType="DNA"
        onSubmit={mockOnSubmitLocal}
      />
    );

    const textarea = screen.getByPlaceholderText('Enter DNA sequence here...');
    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: false });

    expect(mockOnSubmitLocal).not.toHaveBeenCalled();
  });
});
