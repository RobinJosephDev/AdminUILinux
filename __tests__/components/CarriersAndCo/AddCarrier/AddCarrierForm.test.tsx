import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddCarrierForm from '../../../../src/components/Carriers&Co/AddCarrier/AddCarrierForm';

const mockOnClose = vi.fn();
const mockOnAddCarrier = vi.fn();

describe('AddCarrierForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks(); 
  });

  it('renders form correctly', () => {
    render(<AddCarrierForm onClose={mockOnClose} onAddCarrier={mockOnAddCarrier} />);
    expect(screen.getByText('Add Carrier')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddCarrierForm onClose={mockOnClose} onAddCarrier={mockOnAddCarrier} />);

    await user.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
