import { useEffect, useRef } from 'react';
import { Lead } from '../../../types/LeadTypes';

type EditAddressDetailsProps = {
  formLead: Lead;
  setFormLead: (formLead: Lead) => void;
};

function EditAddressDetails({ formLead, setFormLead }: EditAddressDetailsProps) {
  const addressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadGoogleMapsApi = () => {
      if (window.google && window.google.maps) {
        initializeAutocomplete();
        return;
      }

      if (document.querySelector('#google-maps-script')) {
        return; // Prevent duplicate script injection
      }

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent('YOUR_API_KEY')}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google && window.google.maps) {
          initializeAutocomplete();
        } else {
          console.error('Google Maps API failed to load.');
        }
      };

      script.onerror = () => {
        console.error('Failed to load Google Maps API.');
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
    const addressComponents = (place.address_components || []) as google.maps.GeocoderAddressComponent[];

    const streetNumber = getComponent('street_number', '', addressComponents);
    const route = getComponent('route', '', addressComponents);
    const mainAddress = `${streetNumber} ${route}`.trim();

    setFormLead({
      ...formLead,
      address: mainAddress,
      city: getComponent('locality', '', addressComponents),
      state: getComponent('administrative_area_level_1', '', addressComponents),
      country: getComponent('country', '', addressComponents),
      postal_code: getComponent('postal_code', '', addressComponents),
    });
  };

  const getComponent = (type: string, fallback: string, components: google.maps.GeocoderAddressComponent[]) => {
    const component = components.find((c) => c.types.includes(type));
    return (component?.long_name ?? fallback).trim();
  };

  return (
    <fieldset className="form-section">
      <legend>Address Details</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            value={formLead.address}
            onChange={(e) => setFormLead({ ...formLead, address: e.target.value.trim() })}
            id="address"
            ref={addressRef}
            placeholder="Enter your address"
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="unitNo">Unit No</label>
          <input type="text" value={formLead.unit_no} onChange={(e) => setFormLead({ ...formLead, unit_no: e.target.value.trim() })} id="unitNo" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="city">City</label>
          <input type="text" value={formLead.city} onChange={(e) => setFormLead({ ...formLead, city: e.target.value.trim() })} id="city" />
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="state">State</label>
          <input type="text" value={formLead.state} onChange={(e) => setFormLead({ ...formLead, state: e.target.value.trim() })} id="state" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="country">Country</label>
          <input type="text" value={formLead.country} onChange={(e) => setFormLead({ ...formLead, country: e.target.value.trim() })} id="country" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            value={formLead.postal_code}
            onChange={(e) => setFormLead({ ...formLead, postal_code: e.target.value.trim() })}
            id="postalCode"
          />
        </div>
      </div>
    </fieldset>
  );
}

export default EditAddressDetails;
