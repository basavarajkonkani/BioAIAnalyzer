import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from './FileUpload';

describe('FileUpload', () => {
  const mockOnFileSelect = vi.fn();

  it('should render upload area with instructions', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    expect(screen.getByText(/Click to upload or drag and drop/)).toBeInTheDocument();
    expect(screen.getByText(/FASTA or GenBank files/)).toBeInTheDocument();
    expect(screen.getByText(/Maximum file size: 10MB/)).toBeInTheDocument();
  });

  it('should accept valid file with correct extension', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['ATGC'], 'sequence.fasta', { type: 'text/plain' });
    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    expect(screen.getByText('sequence.fasta')).toBeInTheDocument();
  });

  it('should show error for unsupported file format', async () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['content'], 'document.txt', { type: 'text/plain' });
    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/Unsupported file format/)).toBeInTheDocument();
    });
  });

  it('should show error for file exceeding size limit', async () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    // Create a file larger than 10MB
    const largeContent = new Array(11 * 1024 * 1024).fill('A').join('');
    const file = new File([largeContent], 'large.fasta', { type: 'text/plain' });
    Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 });

    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/File size exceeds 10MB limit/)).toBeInTheDocument();
    });
  });

  it('should accept all allowed file extensions', () => {
    const extensions = ['.fasta', '.fa', '.gb', '.gbk'];

    extensions.forEach((ext) => {
      mockOnFileSelect.mockClear();
      const { unmount } = render(<FileUpload onFileSelect={mockOnFileSelect} />);

      const file = new File(['ATGC'], `sequence${ext}`, { type: 'text/plain' });
      const input = document.querySelector('input[type="file"]');

      fireEvent.change(input, { target: { files: [file] } });

      expect(mockOnFileSelect).toHaveBeenCalledWith(file);
      unmount();
    });
  });

  it('should display file size in KB', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const content = new Array(2048).fill('A').join(''); // 2KB
    const file = new File([content], 'sequence.fasta', { type: 'text/plain' });

    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText(/2.00 KB/)).toBeInTheDocument();
  });

  it('should handle drag over event', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const dropZone = screen.getByText(/Click to upload or drag and drop/).closest('div').parentElement;
    fireEvent.dragOver(dropZone);

    expect(dropZone).toHaveClass('border-blue-500');
  });

  it('should handle drag leave event', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const dropZone = screen.getByText(/Click to upload or drag and drop/).closest('div').parentElement;
    fireEvent.dragOver(dropZone);
    fireEvent.dragLeave(dropZone);

    expect(dropZone).not.toHaveClass('border-blue-500');
  });

  it('should handle file drop', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['ATGC'], 'sequence.fasta', { type: 'text/plain' });
    const dropZone = screen.getByText(/Click to upload or drag and drop/).closest('div').parentElement;

    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });

    expect(mockOnFileSelect).toHaveBeenCalledWith(file);
  });
});
