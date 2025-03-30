import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import CarrierDetails from '../../../../src/components/Carriers&Co/AddCarrier/CarrierDetails';
import { mockCarrier } from '../../../mocks/CarriersAndCo/mockCarrier';

const mockSetCarrier = vi.fn();

describe('CarrierDetails Component', () => {
  afterEach(() => {
    vi.restoreAllMocks(); // Restore all spies/mocks
  });

  it('renders CarrierDetails form fields', () => {
    render(<CarrierDetails carrier={mockCarrier} setCarrier={mockSetCarrier} />);
    expect(screen.getByLabelText(/Carrier Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Broker Carrier Agreement/i)).toBeInTheDocument();
  });

  it('updates carrier type selection', () => {
    render(<CarrierDetails carrier={mockCarrier} setCarrier={mockSetCarrier} />);
    const select = screen.getByLabelText(/Carrier Type/i);
    fireEvent.change(select, { target: { value: 'US Authorization' } });

    expect(mockSetCarrier).toHaveBeenCalledWith({
      ...mockCarrier,
      carr_type: 'US Authorization',
    });
  });

  it('uploads a file successfully', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ fileUrl: 'http://example.com/test.pdf' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    render(<CarrierDetails carrier={mockCarrier} setCarrier={mockSetCarrier} />);
    const fileInput = screen.getByLabelText(/Broker Carrier Agreement/i);
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockSetCarrier).toHaveBeenCalledWith({
        ...mockCarrier,
        brok_carr_aggmt: 'http://example.com/test.pdf',
      });
    });
  });

  it('handles failed file upload', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response('Upload failed', { status: 400 }));
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<CarrierDetails carrier={mockCarrier} setCarrier={mockSetCarrier} />);
    const fileInput = screen.getByLabelText(/Broker Carrier Agreement/i);
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('File upload failed. Please try again.');
    });
  });
});
