import { useEffect, useRef } from 'react';
import { Customer } from '../../../types/CustomerTypes';

type AccountsPayableProps = {
  formCustomer: Customer;
  setFormCustomer: React.Dispatch<React.SetStateAction<Customer>>;
};

const AccountsPayable: React.FC<AccountsPayableProps> = ({ formCustomer, setFormCustomer }) => {
  const addressRef = useRef<HTMLInputElement>(null);

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
    if (!addressRef.current || !window.google?.maps?.places) return;

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

    const getComponent = (type: string, fallback: string) => {
      const component = addressComponents.find((c) => c.types.includes(type));
      return component ? component.long_name : fallback;
    };

    const streetNumber = getComponent('street_number', '');
    const route = getComponent('route', '');
    const mainAddress = `${streetNumber} ${route}`.trim();

    setFormCustomer((prevCustomer) => ({
      ...prevCustomer,
      cust_ap_address: mainAddress,
      cust_ap_city: getComponent('locality', ''),
      cust_ap_state: getComponent('administrative_area_level_1', ''),
      cust_ap_country: getComponent('country', ''),
      cust_ap_postal: getComponent('postal_code', ''),
    }));
  };

  return (
    <fieldset>
      <legend>Accounts Payable</legend>

      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="accountsPayableName">Name</label>
          <input
            type="text"
            id="accountsPayableName"
            value={formCustomer.cust_ap_name}
            onChange={(e) => setFormCustomer((prev) => ({ ...prev, cust_ap_name: e.target.value }))}
          />
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="street">Street</label>
          <input
            type="text"
            id="street"
            ref={addressRef}
            value={formCustomer.cust_ap_address}
            onChange={(e) => setFormCustomer((prev) => ({ ...prev, cust_ap_address: e.target.value }))}
            placeholder="Enter your address"
          />
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            value={formCustomer.cust_ap_city}
            onChange={(e) => setFormCustomer((prev) => ({ ...prev, cust_ap_city: e.target.value }))}
          />
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            value={formCustomer.cust_ap_state}
            onChange={(e) => setFormCustomer((prev) => ({ ...prev, cust_ap_state: e.target.value }))}
          />
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            value={formCustomer.cust_ap_country}
            onChange={(e) => setFormCustomer((prev) => ({ ...prev, cust_ap_country: e.target.value }))}
          />
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            value={formCustomer.cust_ap_postal}
            onChange={(e) => setFormCustomer((prev) => ({ ...prev, cust_ap_postal: e.target.value }))}
          />
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="unitNo">Unit No</label>
          <input
            type="text"
            id="unitNo"
            value={formCustomer.cust_ap_unit_no}
            onChange={(e) => setFormCustomer((prev) => ({ ...prev, cust_ap_unit_no: e.target.value }))}
          />
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formCustomer.cust_ap_email}
            onChange={(e) => setFormCustomer((prev) => ({ ...prev, cust_ap_email: e.target.value }))}
          />
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            value={formCustomer.cust_ap_phone}
            onChange={(e) => setFormCustomer((prev) => ({ ...prev, cust_ap_phone: e.target.value }))}
          />
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="phoneExt">Phone Ext</label>
          <input
            type="text"
            id="phoneExt"
            value={formCustomer.cust_ap_phone_ext}
            onChange={(e) => setFormCustomer((prev) => ({ ...prev, cust_ap_phone_ext: e.target.value }))}
          />
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="fax">Fax</label>
          <input
            type="text"
            id="fax"
            value={formCustomer.cust_ap_fax}
            onChange={(e) => setFormCustomer((prev) => ({ ...prev, cust_ap_fax: e.target.value }))}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default AccountsPayable;
