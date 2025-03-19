import React, { useEffect, useRef } from 'react';
import { DeleteOutlined } from '@ant-design/icons';

interface Delivery {
  address: string;
  city: string;
  state: string;
  country: string;
  postal: string;
  rate: number;
  currency: string;
  equipment: string;
  packages: number;
  dimensions: string;
  notes: string;
}

interface EditQuoteDeliveryProps {
  delivery: Delivery;
  index: number;
  onChange: (index: number, delivery: Delivery) => void;
  onRemove: (index: number) => void;
}

const EditQuoteDelivery: React.FC<EditQuoteDeliveryProps> = ({ delivery, index, onChange, onRemove }) => {
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
    const getComponent = (type: string, fallback: string) => {
      const component = place.address_components?.find((c) => c.types.includes(type));
      return component ? component.long_name : fallback;
    };

    onChange(index, {
      ...delivery,
      address: `${getComponent('street_number', '')} ${getComponent('route', '')}`.trim(),
      city: getComponent('locality', ''),
      state: getComponent('administrative_area_level_1', ''),
      country: getComponent('country', ''),
      postal: getComponent('postal_code', ''),
    });
  };

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange(index, { ...delivery, [name]: value });
  };

  return (
    <fieldset className="form-section">
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Address</label>
          <input type="text" name="address" value={delivery.address} onChange={handleDeliveryChange} ref={addressRef} placeholder="Address" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>City</label>
          <input type="text" name="city" value={delivery.city} onChange={handleDeliveryChange} placeholder="City" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>State</label>
          <input type="text" name="state" value={delivery.state} onChange={handleDeliveryChange} placeholder="State" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Postal Code</label>
          <input type="text" name="postal" value={delivery.postal} onChange={handleDeliveryChange} placeholder="Postal Code" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Country</label>
          <input type="text" name="country" value={delivery.country} onChange={handleDeliveryChange} placeholder="Country" />
        </div>
      </div>
      <button type="button" onClick={() => onRemove(index)} className="org-des-remove" style={{ float: 'right', marginTop: '10px' }}>
        <DeleteOutlined />
      </button>
    </fieldset>
  );
};

export default EditQuoteDelivery;
