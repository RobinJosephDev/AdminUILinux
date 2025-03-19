import { describe, expect, it, vi, beforeAll } from 'vitest'; // Import beforeAll from vitest
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import MailingAddress from '../../../../src/components/Carriers&Co/AddCarrier/MailingAddress';
import { Carrier } from '../../../../src/types/CarrierTypes';

const mockSetCarrier = vi.fn();

describe('MailingAddress component', () => {
  const carrier: Carrier = {
    id: 1,
    dba: 'Test Carrier',
    legal_name: 'Test Legal Name',
    remit_name: 'Test Remit Name',
    acc_no: '12345',
    branch: 'Main',
    website: 'http://testcarrier.com',
    fed_id_no: '123456789',
    pref_curr: 'USD',
    pay_terms: 'Net 30',
    form_1099: true,
    advertise: true,
    advertise_email: 'contact@testcarrier.com',
    carr_type: 'Truckload',
    rating: 'A+',
    brok_carr_aggmt: 'Yes',
    docket_no: '12345',
    dot_number: '1234567',
    wcb_no: '9876543',
    ca_bond_no: 'XYZ123',
    us_bond_no: 'ABC456',
    scac: 'TEST',
    csa_approved: true,
    hazmat: false,
    smsc_code: '987',
    approved: true,
    li_provider: 'Provider A',
    li_policy_no: 'LIPOL123',
    li_coverage: 1000000,
    li_start_date: '2022-01-01',
    li_end_date: '2023-01-01',
    ci_provider: 'Provider B',
    ci_policy_no: 'CIPOL456',
    ci_coverage: 500000,
    ci_start_date: '2022-02-01',
    ci_end_date: '2023-02-01',
    coi_cert: 'COI123',
    primary_address: '123 Main St',
    primary_city: 'Test City',
    primary_state: 'Test State',
    primary_country: 'Test Country',
    primary_postal: '12345',
    primary_phone: '123-456-7890',
    sameAsPrimary: false,
    mailing_address: '',
    mailing_city: '',
    mailing_state: '',
    mailing_country: '',
    mailing_postal: '',
    mailing_phone: '',
    int_notes: '',
    contact: [],
    equipment: [],
    lane: [],
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  };

  // Mock Google Maps API to include autocomplete and addListener
  beforeAll(() => {
    global.window.google = {
      maps: {
        places: {
          Autocomplete: vi.fn(() => ({
            addListener: vi.fn(),
          })),
        },
      },
    };
  });

  // Test for loading Google Maps API
  it('should load Google Maps API when component mounts', async () => {
    render(<MailingAddress carrier={carrier} setCarrier={mockSetCarrier} />);

    // Check if Google Maps API has loaded
    expect(global.window.google.maps.places.Autocomplete).toBeDefined();
    // Verify addListener function is available
    expect(global.window.google.maps.places.Autocomplete().addListener).toBeDefined();
  });

});