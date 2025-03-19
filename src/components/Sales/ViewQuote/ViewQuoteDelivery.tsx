import { DeleteOutlined } from '@ant-design/icons';

type Delivery = {
  address?: string;
  city?: string;
  state?: string;
  postal?: string;
  country?: string;
  rate?: string;
  currency?: string;
  equipment?: string;
  packages?: string;
  dimensions?: string;
  notes?: string;
};

type ViewQuoteDeliveryProps = {
  delivery: Delivery;
  index: number;
  onRemove?: (index: number) => void;
};

const ViewQuoteDelivery: React.FC<ViewQuoteDeliveryProps> = ({ delivery, index, onRemove }) => {
  return (
    <fieldset className="form-section">
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Address</label>
          <p>{delivery.address || 'N/A'}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>City</label>
          <p>{delivery.city || 'N/A'}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>State</label>
          <p>{delivery.state || 'N/A'}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Postal Code</label>
          <p>{delivery.postal || 'N/A'}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Country</label>
          <p>{delivery.country || 'N/A'}</p>
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Rate</label>
          <p>{delivery.rate || 'N/A'}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Currency</label>
          <p>{delivery.currency || 'N/A'}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Equipment</label>
          <p>{delivery.equipment || 'N/A'}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Packages</label>
          <p>{delivery.packages || 'N/A'}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Dimensions</label>
          <p>{delivery.dimensions || 'N/A'}</p>
        </div>
      </div>

      <div className="form-group" style={{ flex: 1 }}>
        <label>Notes</label>
        <p>{delivery.notes || 'N/A'}</p>
      </div>
    </fieldset>
  );
};

export default ViewQuoteDelivery;
