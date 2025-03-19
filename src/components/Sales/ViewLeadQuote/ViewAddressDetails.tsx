import { useEffect, useRef } from 'react';

type AddressDetailsProps = {
  formLead: {
    address?: string;
    unit_no?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
};

function ViewAddressDetails({ formLead }: AddressDetailsProps) {
  const addressRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadGoogleMapsApi = () => {
      if (window.google && window.google.maps) {
        initializeAutocomplete();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps) {
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
    const addressComponents = place.address_components || [];

    // Extract the main address (street_number + route)
    const streetNumber = getComponent('street_number', '', addressComponents);
    const route = getComponent('route', '', addressComponents);
    const mainAddress = `${streetNumber} ${route}`.trim(); // Combine street number and route

    // No need to update state since it's read-only
  };

  const getComponent = (type: string, fallback: string, components: google.maps.GeocoderAddressComponent[]) => {
    const component = components.find((c) => c.types.includes(type));
    return component ? component.long_name : fallback;
  };

  return (
    <fieldset className="form-section">
      <legend>Address Details</legend>
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Address</label>
          <p>{formLead.address || 'N/A'}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Unit No</label>
          <p>{formLead.unit_no || 'N/A'}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>City</label>
          <p>{formLead.city || 'N/A'}</p>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>State</label>
          <p>{formLead.state || 'N/A'}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Country</label>
          <p>{formLead.country || 'N/A'}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Postal Code</label>
          <p>{formLead.postal_code || 'N/A'}</p>
        </div>
      </div>
    </fieldset>
  );
}

export default ViewAddressDetails;
