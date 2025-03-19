import { useEffect, useRef } from 'react';
import { Lead } from '../../../types/LeadTypes';

/// <reference types="@types/google.maps" />

interface AddressDetailsProps {
  lead: Lead;
  setLead: (lead: AddressDetailsProps['lead']) => void;
}

const AddressDetails: React.FC<AddressDetailsProps> = ({ lead, setLead }) => {
  const addressRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadGoogleMapsApi = () => {
      if (window.google?.maps) {
        initializeAutocomplete();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.maps) {
          initializeAutocomplete();
        }
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsApi();
  }, []);

  const initializeAutocomplete = () => {
    if (!addressRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, {
      types: ['address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place || !place.address_components) {
        console.error('No valid address selected');
        return;
      }
      updateAddressFields(place);
    });
  };

  const updateAddressFields = (place: google.maps.places.PlaceResult) => {
    if (!place.address_components) return;

    const addressComponents = place.address_components;
    const streetNumber = getComponent('street_number', '', addressComponents);
    const route = getComponent('route', '', addressComponents);
    const mainAddress = sanitizeInput(`${streetNumber} ${route}`.trim());

    setLead({
      ...lead,
      address: mainAddress,
      city: sanitizeInput(getComponent('locality', '', addressComponents)),
      state: sanitizeInput(getComponent('administrative_area_level_1', '', addressComponents)),
      country: sanitizeInput(getComponent('country', '', addressComponents)),
      postal_code: sanitizePostalCode(getComponent('postal_code', '', addressComponents)),
    });
  };

  const getComponent = (type: string, fallback: string, components: google.maps.GeocoderAddressComponent[]) => {
    const component = components.find((c) => c.types.includes(type));
    return component ? component.long_name : fallback;
  };

  const sanitizeInput = (input: string) => {
    return input.replace(/[^a-zA-Z0-9\s,.-]/g, '');
  };

  const sanitizePostalCode = (postalCode: string) => {
    return postalCode.replace(/[^a-zA-Z0-9]/g, '');
  };

  const handleInputChange = (field: keyof Lead) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = sanitizeInput(e.target.value);
    if (field === 'postal_code') value = sanitizePostalCode(value);
    setLead({ ...lead, [field]: value });
  };

  return (
    <fieldset className="form-section">
      <legend>Address Details</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="address">Address</label>
          <input type="text" value={lead.address} onChange={handleInputChange('address')} id="address" ref={addressRef} placeholder="Address" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="unitNo">Unit No</label>
          <input type="text" value={lead.unit_no || ''} onChange={handleInputChange('unit_no')} id="unitNo" placeholder="Unit No" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="city">City</label>
          <input type="text" value={lead.city} onChange={handleInputChange('city')} id="city" placeholder="City" />
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="state">State</label>
          <input type="text" value={lead.state} onChange={handleInputChange('state')} id="state" placeholder="State" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="country">Country</label>
          <input type="text" value={lead.country} onChange={handleInputChange('country')} id="country" placeholder="Country" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="postalCode">Postal Code</label>
          <input type="text" value={lead.postal_code} onChange={handleInputChange('postal_code')} id="postalCode" placeholder="Postal Code" />
        </div>
      </div>
    </fieldset>
  );
};

export default AddressDetails;
