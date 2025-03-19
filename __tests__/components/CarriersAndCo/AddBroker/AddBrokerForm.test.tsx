import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import AddBrokerForm from '../../../../src/components/Carriers&Co/AddBroker/AddBrokerForm';

vi.mock('../../../src/hooks/add/useAddBroker', () => ({
  useAddBroker: vi.fn(() => ({
    broker: {},
    setBroker: vi.fn(),
    handleSubmit: vi.fn((e) => e.preventDefault()),
  })),
}));

describe('AddBrokerForm Component', () => {
  const mockOnClose = vi.fn();
  const mockOnAddBroker = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(<AddBrokerForm onClose={mockOnClose} onAddBroker={mockOnAddBroker} />);

    expect(screen.getByRole('button', { name: /add broker/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(<AddBrokerForm onClose={mockOnClose} onAddBroker={mockOnAddBroker} />);

    // Get all buttons with "Cancel" text
    const cancelButtons = screen.getAllByRole('button', { name: /cancel/i });

    // Click the first "Cancel" button (or the correct one based on UI)
    fireEvent.click(cancelButtons[0]);

    expect(mockOnClose).toHaveBeenCalled();
  });
  it('prevents default form submission', () => {
    const { container } = render(<AddBrokerForm onClose={mockOnClose} onAddBroker={mockOnAddBroker} />);

    // Select form using querySelector
    const form = container.querySelector('form');

    expect(form).not.toBeNull(); // Ensure form is found

    fireEvent.submit(form!);
    expect(mockOnAddBroker).not.toHaveBeenCalled();
  });
});
