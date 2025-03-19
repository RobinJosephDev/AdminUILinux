import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BrokerDetails from '../../../../src/components/Carriers&Co/AddBroker/BrokerDetails';
import { Broker } from '../../../../src/types/BrokerTypes';
import { useState } from 'react';

const MockBrokerDetails = () => {
  const [broker, setBroker] = useState<Broker>({
    id: 0,
    broker_name: '',
    broker_address: '',
    broker_city: '',
    broker_state: '',
    broker_country: '',
    broker_postal: '',
    broker_email: '',
    broker_phone: '',
    broker_ext: '',
    broker_fax: '',
    created_at: '',
    updated_at: '',
  });

  return <BrokerDetails broker={broker} setBroker={setBroker} />;
};

describe('BrokerDetails Component', () => {
  it('updates the broker name when input changes', () => {
    render(<MockBrokerDetails />);

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Sealink Logistics' } });

    expect(nameInput).toHaveValue('Sealink Logistics');
  });

  it('updates the broker address when input changes', () => {
    render(<MockBrokerDetails />);

    const addressInput = screen.getByLabelText(/street/i);
    fireEvent.change(addressInput, { target: { value: '123 Test St' } });

    expect(addressInput).toHaveValue('123 Test St');
  });

  it('updates the broker city when input changes', () => {
    render(<MockBrokerDetails />);

    const cityInput = screen.getByLabelText(/city/i);
    fireEvent.change(cityInput, { target: { value: 'Test City' } });

    expect(cityInput).toHaveValue('Test City');
  });

  it('updates the broker state when input changes', () => {
    render(<MockBrokerDetails />);

    const stateInput = screen.getByLabelText(/state/i);
    fireEvent.change(stateInput, { target: { value: 'Test State' } });

    expect(stateInput).toHaveValue('Test State');
  });

  it('updates the broker country when input changes', () => {
    render(<MockBrokerDetails />);

    const countryInput = screen.getByLabelText(/country/i);
    fireEvent.change(countryInput, { target: { value: 'Test Country' } });

    expect(countryInput).toHaveValue('Test Country');
  });

  it('updates the broker postal code when input changes', () => {
    render(<MockBrokerDetails />);

    const postalInput = screen.getByLabelText(/postal code/i);
    fireEvent.change(postalInput, { target: { value: '12345' } });

    expect(postalInput).toHaveValue('12345');
  });
});
