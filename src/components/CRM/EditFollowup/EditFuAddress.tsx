import { useEffect, useRef } from 'react';
import { Followup } from '../../../types/FollowupTypes';

interface EditFuAddressProps {
  followupEdit: Followup;
  setFollowupEdit: (edit: Followup) => void;
}

const sanitizeInput = (value: string): string => {
  return value.trim().replace(/<[^>]*>?/gm, ''); // Remove HTML tags
};

const EditFuAddress: React.FC<EditFuAddressProps> = ({ followupEdit, setFollowupEdit }) => {
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

      return () => {
        document.head.removeChild(script); // Cleanup on unmount
      };
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

    const getComponent = (type: string, fallback: string): string => {
      const component = place.address_components?.find((c) => c.types.includes(type));
      return component ? sanitizeInput(component.long_name) : fallback;
    };

    const streetNumber = getComponent('street_number', '');
    const route = getComponent('route', '');
    const mainAddress = `${streetNumber} ${route}`.trim();

    setFollowupEdit({
      ...followupEdit,
      address: mainAddress,
      city: getComponent('locality', ''),
      state: getComponent('administrative_area_level_1', ''),
      country: getComponent('country', ''),
      postal_code: getComponent('postal_code', ''),
    });
  };

  const handleInputChange = (field: keyof Followup, value: string) => {
    setFollowupEdit({ ...followupEdit, [field]: sanitizeInput(value) });
  };

  return (
    <fieldset className="form-section">
      <legend>Address Details</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        {/* Address */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            ref={addressRef}
            value={followupEdit.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter your address"
          />
        </div>

        {/* Unit Number */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="unitNo">Unit No</label>
          <input type="text" id="unitNo" value={followupEdit.unit_no} onChange={(e) => handleInputChange('unit_no', e.target.value)} />
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        {/* City */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="city">City</label>
          <input type="text" id="city" value={followupEdit.city} onChange={(e) => handleInputChange('city', e.target.value)} />
        </div>

        {/* State */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="state">State</label>
          <input type="text" id="state" value={followupEdit.state} onChange={(e) => handleInputChange('state', e.target.value)} />
        </div>

        {/* Country */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="country">Country</label>
          <input type="text" id="country" value={followupEdit.country} onChange={(e) => handleInputChange('country', e.target.value)} />
        </div>

        {/* Postal Code */}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="postalCode">Postal Code</label>
          <input type="text" id="postalCode" value={followupEdit.postal_code} onChange={(e) => handleInputChange('postal_code', e.target.value)} />
        </div>
      </div>
    </fieldset>
  );
};

export default EditFuAddress;
