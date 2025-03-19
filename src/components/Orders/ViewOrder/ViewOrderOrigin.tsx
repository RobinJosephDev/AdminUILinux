import { DeleteOutlined } from '@ant-design/icons';
import React from 'react';

interface Origin {
  address?: string;
  city?: string;
  state?: string;
  postal?: string;
  country?: string;
  date?: string;
  time?: string;
  currency?: string;
  equipment?: string;
  pickup_po?: string;
  phone?: string;
  packages?: string;
  weight?: string;
  dimensions?: string;
  notes?: string;
}

interface ViewOrderOriginProps {
  order: any; // Adjust type as needed
  origin?: Origin;
  index: number;
  onRemove?: (index: number) => void;
}

const ViewOrderOrigin: React.FC<ViewOrderOriginProps> = ({ order, origin = {}, index, onRemove }) => {
  return (
    <fieldset className="form-section">
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Address</label>
          <div>{origin.address || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>City</label>
          <div>{origin.city || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>State</label>
          <div>{origin.state || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Postal Code</label>
          <div>{origin.postal || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Country</label>
          <div>{origin.country || ''}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Date</label>
          <div>{origin.date || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Time</label>
          <div>{origin.time || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Currency</label>
          <div>{origin.currency || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Equipment</label>
          <div>{origin.equipment || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Pickup PO</label>
          <div>{origin.pickup_po || ''}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Phone</label>
          <div>{origin.phone || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Packages</label>
          <div>{origin.packages || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Weight</label>
          <div>{origin.weight || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Dimensions</label>
          <div>{origin.dimensions || ''}</div>
        </div>
      </div>
      <div className="form-group" style={{ flex: 1 }}>
        <label>Notes</label>
        <div>{origin.notes || ''}</div>
      </div>
      {onRemove && (
        <button onClick={() => onRemove(index)} style={{ marginTop: '1rem', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>
          <DeleteOutlined /> Remove
        </button>
      )}
    </fieldset>
  );
};

export default ViewOrderOrigin;
