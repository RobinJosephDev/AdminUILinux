import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import InternalNotes from '../../../../src/components/Carriers&Co/AddCarrier/InternalNotes';
import { mockCarrier } from '../../../mocks/CarriersAndCo/mockCarrier';

const mockSetCarrier = vi.fn();

describe('InternalNotes Component', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders textarea for internal notes', () => {
    render(<InternalNotes carrier={mockCarrier} setCarrier={mockSetCarrier} />);

    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('updates internal notes when typed', () => {
    render(<InternalNotes carrier={mockCarrier} setCarrier={mockSetCarrier} />);

    const textarea = screen.getByLabelText(/notes/i);
    fireEvent.change(textarea, { target: { value: 'New internal note' } });

    expect(mockSetCarrier).toHaveBeenCalledWith({
      ...mockCarrier,
      int_notes: 'New internal note',
    });
  });

  it('does not allow notes exceeding 1000 characters', () => {
    render(<InternalNotes carrier={mockCarrier} setCarrier={mockSetCarrier} />);

    const textarea = screen.getByLabelText(/notes/i);
    const longText = 'a'.repeat(1001);

    fireEvent.change(textarea, { target: { value: longText } });

    expect(mockSetCarrier).not.toHaveBeenCalled();
    expect(screen.getByText(/Notes cannot exceed 1000 characters./i)).toBeInTheDocument();
  });
});
