import { useEffect, useRef } from 'react';
import { Customer } from '../../../types/CustomerTypes';

type Props = {
  formCustomer: Customer;
  setFormCustomer: React.Dispatch<React.SetStateAction<Customer>>;
};

function CustomerMailingAddressForm({ formCustomer, setFormCustomer }: Props) {
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
    const getComponent = (type: string, fallback: string) => addressComponents.find((c) => c.types.includes(type))?.long_name || fallback;

    const streetNumber = getComponent('street_number', '');
    const route = getComponent('route', '');
    const mainAddress = `${streetNumber} ${route}`.trim();

    setFormCustomer((prevCustomer) => ({
      ...prevCustomer,
      cust_mailing_address: mainAddress,
      cust_mailing_city: getComponent('locality', ''),
      cust_mailing_state: getComponent('administrative_area_level_1', ''),
      cust_mailing_country: getComponent('country', ''),
      cust_mailing_postal: getComponent('postal_code', ''),
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormCustomer((prevCustomer) => ({
      ...prevCustomer,
      sameAsPrimary: checked,
      ...(checked && {
        cust_mailing_address: '',
        cust_mailing_city: '',
        cust_mailing_state: '',
        cust_mailing_country: '',
        cust_mailing_postal: '',
        cust_mailing_unit_no: '',
      }),
    }));
  };

  return (
    <fieldset>
      <legend>Mailing Address</legend>
      <div className="form-group">
        <label htmlFor="mailingAddressSame">
          Same as Primary Address
          <input type="checkbox" id="mailingAddressSame" checked={formCustomer.sameAsPrimary} onChange={handleCheckboxChange} />
        </label>
      </div>
      {!formCustomer.sameAsPrimary && (
        <>
          <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="mailingAddressStreet">Street</label>
              <input
                id="mailingAddressStreet"
                ref={addressRef}
                value={formCustomer.cust_mailing_address}
                onChange={(e) => setFormCustomer((prev) => ({ ...prev, cust_mailing_address: e.target.value }))}
                placeholder="Enter your address"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="mailingAddressCity">City</label>
              <input
                id="mailingAddressCity"
                value={formCustomer.cust_mailing_city}
                onChange={(e) => setFormCustomer((prev) => ({ ...prev, cust_mailing_city: e.target.value }))}
                placeholder="City"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="mailingAddressState">State</label>
              <input
                id="mailingAddressState"
                value={formCustomer.cust_mailing_state}
                onChange={(e) => setFormCustomer((prev) => ({ ...prev, cust_mailing_state: e.target.value }))}
                placeholder="State"
              />
            </div>
          </div>
          <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="mailingAddressCountry">Country</label>
              <input
                id="mailingAddressCountry"
                value={formCustomer.cust_mailing_country}
                onChange={(e) => setFormCustomer((prev) => ({ ...prev, cust_mailing_country: e.target.value }))}
                placeholder="Country"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="mailingAddressPostal">Postal Code</label>
              <input
                id="mailingAddressPostal"
                value={formCustomer.cust_mailing_postal}
                onChange={(e) => setFormCustomer((prev) => ({ ...prev, cust_mailing_postal: e.target.value }))}
                placeholder="Postal Code"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="mailingAddressUnitNo">Unit No</label>
              <input
                id="mailingAddressUnitNo"
                value={formCustomer.cust_mailing_unit_no}
                onChange={(e) => setFormCustomer((prev) => ({ ...prev, cust_mailing_unit_no: e.target.value }))}
                placeholder="Unit No"
              />
            </div>
          </div>
        </>
      )}
    </fieldset>
  );
}

export default CustomerMailingAddressForm;
