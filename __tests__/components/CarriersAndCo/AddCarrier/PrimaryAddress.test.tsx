import { render, screen, fireEvent } from '@testing-library/react';
import PrimaryAddress from '../../../../src/components/Carriers&Co/AddCarrier/PrimaryAddress';
import { mockCarrier } from '../../../mocks/CarriersAndCo/mockCarrier';
import '@testing-library/jest-dom';
import { useState } from 'react';
import { describe, expect, it, vi, beforeAll, afterEach } from 'vitest';
import { Carrier } from '../../../../src/styles/types/CarrierTypes';

// Define proper types for PrimaryAddress props
interface PrimaryAddressProps {
  carrier: Carrier;
  setCarrier: React.Dispatch<React.SetStateAction<Carrier>>;
}

// Mock Google Maps API
beforeAll(() => {
  global.window.google = {
    maps: {
      places: {
        Autocomplete: vi.fn().mockImplementation(() => ({
          addListener: vi.fn(),
          getPlace: vi.fn().mockReturnValue({
            address_components: [
              { long_name: '123', types: ['street_number'] },
              { long_name: 'Main St', types: ['route'] },
              { long_name: 'New York', types: ['locality'] },
              { long_name: 'NY', types: ['administrative_area_level_1'] },
              { long_name: 'USA', types: ['country'] },
              { long_name: '10001', types: ['postal_code'] },
            ],
          }),
        })),
      },
    },
  } as any;
});

// Cleanup after each test
afterEach(() => {
  vi.restoreAllMocks();
});

describe('PrimaryAddress Component', () => {
  it('renders the PrimaryAddress component with all input fields', () => {
    const Wrapper: React.FC = () => {
      const [carrier, setCarrier] = useState<Carrier>(mockCarrier);
      return <PrimaryAddress carrier={carrier} setCarrier={setCarrier} />;
    };

    render(<Wrapper />);

    expect(screen.getByText('Primary Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Street')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('State')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Country')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Postal Code')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
  });
});
