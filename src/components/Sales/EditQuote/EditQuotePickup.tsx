import { useEffect, useRef } from 'react';
import { DeleteOutlined } from '@ant-design/icons';

interface Pickup {
  address: string;
  city: string;
  state: string;
  postal: string;
  country: string;
}

interface EditQuotePickupProps {
  pickup: Pickup;
  index: number;
  onChange: (index: number, updatedPickup: Pickup) => void;
  onRemove: (index: number) => void;
}

function EditQuotePickup({ pickup, index, onChange, onRemove }: EditQuotePickupProps) {
  const addressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadGoogleMapsApi = () => {
      if (window.google && window.google.maps) {
        initializeAutocomplete();
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
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
    const getComponent = (type: string, fallback = '') => {
      const component = addressComponents.find((c) => c.types.includes(type));
      return component ? component.long_name : fallback;
    };

    const streetNumber = getComponent('street_number');
    const route = getComponent('route');
    const mainAddress = `${streetNumber} ${route}`.trim();

    onChange(index, {
      ...pickup,
      address: mainAddress,
      city: getComponent('locality'),
      state: getComponent('administrative_area_level_1'),
      country: getComponent('country'),
      postal: getComponent('postal_code'),
    });
  };

  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(index, { ...pickup, [name]: value });
  };

  return (
    <div className="contact-form">
      <div className="form-group">
        <label>Address</label>
        <input type="text" name="address" value={pickup.address} onChange={handlePickupChange} ref={addressRef} placeholder="Enter your address" />
      </div>
      <div className="form-group">
        <label>City</label>
        <input type="text" name="city" value={pickup.city} onChange={handlePickupChange} />
      </div>
      <div className="form-group">
        <label>State</label>
        <input type="text" name="state" value={pickup.state} onChange={handlePickupChange} />
      </div>
      <div className="form-group">
        <label>Postal Code</label>
        <input type="text" name="postal" value={pickup.postal} onChange={handlePickupChange} />
      </div>
      <div className="form-group">
        <label>Country</label>
        <input type="text" name="country" value={pickup.country} onChange={handlePickupChange} />
      </div>
      <button type="button" onClick={() => onRemove(index)} className="remove">
        <DeleteOutlined />
      </button>
    </div>
  );
}

export default EditQuotePickup;
