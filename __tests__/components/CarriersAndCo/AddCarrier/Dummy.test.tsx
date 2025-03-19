import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import AddCarrierForm from '../../../../src/components/Carriers&Co/AddCarrier/AddCarrierForm';
import userEvent from '@testing-library/user-event';

const mockOnClose = vi.fn();
const mockOnAddCarrier = vi.fn();

describe('AddCarrierForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it('renders form correctly', () => {
    render(<AddCarrierForm onClose={mockOnClose} onAddCarrier={mockOnAddCarrier} />);
    expect(screen.getByText('Add Carrier')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    render(<AddCarrierForm onClose={mockOnClose} onAddCarrier={mockOnAddCarrier} />);
    await userEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onAddCarrier when form is submitted', async () => {
    render(<AddCarrierForm onClose={mockOnClose} onAddCarrier={mockOnAddCarrier} />);

    const getInputByLabel = (label: string) => screen.getByLabelText(new RegExp(label, 'i'));

    // Fill required fields
    await userEvent.type(getInputByLabel('DBA'), 'Test DBA');
    await userEvent.type(getInputByLabel('Legal Name'), 'Test Legal Name');
    await userEvent.type(getInputByLabel('Remit Name'), 'Test Remit Name');
    await userEvent.type(getInputByLabel('Account Number'), '123456');
    await userEvent.type(getInputByLabel('Branch'), 'Main');
    await userEvent.type(getInputByLabel('Website'), 'https://testcarrier.com');
    await userEvent.type(getInputByLabel('Federal ID Number'), '98-7654321');
    await userEvent.type(getInputByLabel('Preferred Currency'), 'USD');
    await userEvent.type(getInputByLabel('Payment Terms'), 'Net 30');

    // Checkboxes
    await userEvent.click(getInputByLabel('1099'));

    // Address Fields
    const cityFields = screen.queryAllByLabelText(/City/i);
    if (cityFields.length > 1) {
      await userEvent.type(cityFields[0], 'New York');
      await userEvent.type(cityFields[1], 'Los Angeles');
    }

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /add carrier/i });

    // Ensure button is present and not disabled
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();

    // Click the submit button
    await act(async () => {
      await userEvent.click(submitButton);
    });

    // Wait for mock function to be called
    await waitFor(() => {
      expect(mockOnAddCarrier).toHaveBeenCalledTimes(1);
      expect(mockOnAddCarrier).toHaveBeenCalledWith(expect.objectContaining({ dba: 'Test DBA' }));
    });

    console.log('✅ Form submission test passed!');
  });
});
