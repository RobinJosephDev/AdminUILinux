import { useEffect, useRef } from 'react';
import { Customer } from '../../../types/CustomerTypes';

type AddressComponents = google.maps.GeocoderAddressComponent[];

type PrimaryAddressProps = {
  formCustomer: Customer;
  setFormCustomer: React.Dispatch<React.SetStateAction<Customer>>;
};

function PrimaryAddress({ formCustomer, setFormCustomer }: PrimaryAddressProps) {
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
      updateAddressFields(place.address_components);
    });
  };

  const updateAddressFields = (addressComponents: AddressComponents) => {
    const getComponent = (type: string, fallback = ''): string => {
      return addressComponents.find((c) => c.types.includes(type))?.long_name || fallback;
    };

    const streetNumber = getComponent('street_number');
    const route = getComponent('route');
    const mainAddress = `${streetNumber} ${route}`.trim();

    setFormCustomer((prevCustomer) => ({
      ...prevCustomer,
      cust_primary_address: mainAddress,
      cust_primary_city: getComponent('locality'),
      cust_primary_state: getComponent('administrative_area_level_1'),
      cust_primary_country: getComponent('country'),
      cust_primary_postal: getComponent('postal_code'),
    }));
  };

  return (
    <fieldset>
      <legend>Primary Address</legend>
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="primaryAddressStreet">Street</label>
          <input
            type="text"
            ref={addressRef}
            placeholder="Enter your address"
            value={formCustomer.cust_primary_address}
            onChange={(e) => setFormCustomer({ ...formCustomer, cust_primary_address: e.target.value })}
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="primaryAddressCity">City</label>
          <input
            type="text"
            value={formCustomer.cust_primary_city}
            onChange={(e) => setFormCustomer({ ...formCustomer, cust_primary_city: e.target.value })}
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="primaryAddressState">State</label>
          <input
            type="text"
            value={formCustomer.cust_primary_state}
            onChange={(e) => setFormCustomer({ ...formCustomer, cust_primary_state: e.target.value })}
          />
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="primaryAddressCountry">Country</label>
          <input
            type="text"
            value={formCustomer.cust_primary_country}
            onChange={(e) => setFormCustomer({ ...formCustomer, cust_primary_country: e.target.value })}
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="primaryAddressPostalCode">Postal Code</label>
          <input
            type="text"
            value={formCustomer.cust_primary_postal}
            onChange={(e) => setFormCustomer({ ...formCustomer, cust_primary_postal: e.target.value })}
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="primaryAddressUnitNo">Unit No</label>
          <input
            type="text"
            value={formCustomer.cust_primary_unit_no || ''}
            onChange={(e) => setFormCustomer({ ...formCustomer, cust_primary_unit_no: e.target.value })}
          />
        </div>
      </div>
    </fieldset>
  );
}

export default PrimaryAddress;
