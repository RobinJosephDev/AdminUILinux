import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CargoInsurance from '../../../../src/components/Carriers&Co/AddCarrier/CargoInsurance';
import { useState } from 'react';
import { mockCarrier } from '../../../mocks/CarriersAndCo/mockCarrier';

const MockCargoInsurance = () => {
  const [carrier, setCarrier] = useState(mockCarrier);

  return <CargoInsurance carrier={carrier} setCarrier={setCarrier} />;
};

describe('CargoInsurance Component', () => {
  it('updates the Cargo Insurance Provider when input changes', () => {
    render(<MockCargoInsurance />);

    const providerInput = screen.getByLabelText(/Cargo Insurance Provider/i);
    fireEvent.change(providerInput, { target: { value: 'Test Provider' } });

    expect(providerInput).toHaveValue('Test Provider');
  });

  it('updates the Policy Number when input changes', () => {
    render(<MockCargoInsurance />);

    const policyInput = screen.getByLabelText(/Policy Number/i);
    fireEvent.change(policyInput, { target: { value: '123456' } });

    expect(policyInput).toHaveValue('123456');
  });

  it('updates the Coverage Amount when input changes', () => {
    render(<MockCargoInsurance />);

    const coverageInput = screen.getByLabelText(/Coverage Amount/i);
    fireEvent.change(coverageInput, { target: { value: '100000' } });

    expect(coverageInput).toHaveValue(100000);
  });

  it('updates the Start Date when input changes', () => {
    render(<MockCargoInsurance />);

    const startDateInput = screen.getByLabelText(/Start Date/i);
    fireEvent.change(startDateInput, { target: { value: '2025-02-15' } });

    expect(startDateInput).toHaveValue('2025-02-15');
  });

  it('updates the End Date when input changes', () => {
    render(<MockCargoInsurance />);

    const endDateInput = screen.getByLabelText(/End Date/i);
    fireEvent.change(endDateInput, { target: { value: '2026-02-15' } });

    expect(endDateInput).toHaveValue('2026-02-15');
  });

  it('renders the CargoInsurance component', () => {
    render(<MockCargoInsurance />);
    screen.debug();
  });

  it('handles file selection correctly', async () => {
    render(<MockCargoInsurance />);

    const fileInput = screen.getByLabelText(/Certificate of Insurance/i);
    expect(fileInput).toBeInTheDocument();

    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

    const fetchMock = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ fileUrl: 'http://example.com/test.pdf' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
      );

    await waitFor(() => fireEvent.change(fileInput, { target: { files: [file] } }));

    await waitFor(() => {
      console.log('Fetch calls:', fetchMock.mock.calls);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    fetchMock.mockRestore();
  });

  it('shows an alert if an invalid file type is uploaded', () => {
    render(<MockCargoInsurance />);

    const fileInput = screen.getByLabelText(/Certificate of Insurance/);
    const invalidFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(alertMock).toHaveBeenCalledWith('Only PDF files are allowed.');

    alertMock.mockRestore();
  });

  it('shows an alert if the file size exceeds the limit', () => {
    render(<MockCargoInsurance />);

    const fileInput = screen.getByLabelText(/Certificate of Insurance/);
    const largeFile = new File(['a'.repeat(6 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(alertMock).toHaveBeenCalledWith('File size must be less than 5MB.');

    alertMock.mockRestore();
  });
});
