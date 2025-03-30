import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import LiabilityInsurance from '../../../../src/components/Carriers&Co/AddCarrier/LiabilityInsurance';
import { mockCarrier } from '../../../mocks/CarriersAndCo/mockCarrier';

const mockSetCarrier = vi.fn();

describe('LiabilityInsurance Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders input fields for liability insurance details', () => {
    render(<LiabilityInsurance carrier={mockCarrier} setCarrier={mockSetCarrier} />);

    expect(screen.getByLabelText(/Liability Insurance Provider/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Policy Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Coverage Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
  });

  it('updates liability insurance provider when typed', () => {
    render(<LiabilityInsurance carrier={mockCarrier} setCarrier={mockSetCarrier} />);

    const input = screen.getByLabelText(/Liability Insurance Provider/i);
    fireEvent.change(input, { target: { value: 'New Provider' } });

    expect(mockSetCarrier).toHaveBeenCalledWith(expect.any(Function));

    const setCarrierCallback = mockSetCarrier.mock.calls[0][0];
    const updatedCarrier = setCarrierCallback(mockCarrier);
    expect(updatedCarrier.li_provider).toBe('New Provider');
  });

  it('does not allow text input exceeding 255 characters', async () => {
    render(<LiabilityInsurance carrier={mockCarrier} setCarrier={mockSetCarrier} />);

    const input = screen.getByLabelText(/Policy Number/i);
    const longText = 'a'.repeat(256);

    fireEvent.change(input, { target: { value: longText } });

    await waitFor(() => {
      expect(screen.getByText(/Cannot exceed 255 characters./i)).toBeInTheDocument();
    });

    expect(mockSetCarrier).not.toHaveBeenCalled();
  });

  it('updates coverage amount if valid', () => {
    render(<LiabilityInsurance carrier={mockCarrier} setCarrier={mockSetCarrier} />);

    const input = screen.getByLabelText(/Coverage Amount/i);
    fireEvent.change(input, { target: { value: '50000' } });

    expect(mockSetCarrier).toHaveBeenCalledWith(expect.any(Function));

    const setCarrierCallback = mockSetCarrier.mock.calls[0][0];
    const updatedCarrier = setCarrierCallback(mockCarrier);
    expect(updatedCarrier.li_coverage).toBe(50000);
  });

  it('does not allow negative coverage amount', async () => {
    render(<LiabilityInsurance carrier={mockCarrier} setCarrier={mockSetCarrier} />);

    const input = screen.getByLabelText(/Coverage Amount/i);
    fireEvent.change(input, { target: { value: '-1000' } });

    await waitFor(() => {
      expect(screen.getByText(/Coverage amount must be a positive number./i)).toBeInTheDocument();
    });

    expect(mockSetCarrier).not.toHaveBeenCalled();
  });

  it('updates start and end dates correctly', async () => {
    render(<LiabilityInsurance carrier={mockCarrier} setCarrier={mockSetCarrier} />);

    const startDateInput = screen.getByLabelText(/Start Date/i);
    fireEvent.change(startDateInput, { target: { value: '2025-01-01' } });
    fireEvent.blur(startDateInput);

    await waitFor(() => {
      expect(mockSetCarrier).toHaveBeenCalled();
    });

    const updateFunction = mockSetCarrier.mock.calls[0][0];
    expect(typeof updateFunction).toBe('function');

    const newState = updateFunction(mockCarrier);
    expect(newState.li_start_date).toBe('2025-01-01');
  });

});
