import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../UserProvider';
import ViewQuoteGeneral from './ViewQuoteGeneral';
import ViewQuotePickup from './ViewQuotePickup';
import ViewQuoteDelivery from './ViewQuoteDelivery';

type QuotePickup = {
  address: string;
  city: string;
  state: string;
  country: string;
  postal: string;
};

type QuoteDelivery = {
  address: string;
  city: string;
  state: string;
  country: string;
  postal: string;
  rate: string;
  currency: string;
  equipment: string;
  notes: string;
  packages: string;
  dimensions: string;
};

type Quote = {
  id: string;
  quote_type: string;
  quote_customer: string;
  quote_cust_ref_no: string;
  quote_booked_by: string;
  quote_temperature: string;
  quote_hot: boolean;
  quote_team: boolean;
  quote_air_ride: boolean;
  quote_tarp: boolean;
  quote_hazmat: boolean;
  quote_pickup: QuotePickup[];
  quote_delivery: QuoteDelivery[];
};

type ViewQuoteFormProps = {
  quote: Quote;
  onClose: () => void;
};

const ViewQuoteForm: React.FC<ViewQuoteFormProps> = ({ quote, onClose }) => {
  const users = useContext(UserContext);

  const [formQuote, setFormQuote] = useState<Quote>({
    id: '',
    quote_type: '',
    quote_customer: '',
    quote_cust_ref_no: '',
    quote_booked_by: '',
    quote_temperature: '',
    quote_hot: false,
    quote_team: false,
    quote_air_ride: false,
    quote_tarp: false,
    quote_hazmat: false,
    quote_pickup: [{ address: '', city: '', state: '', country: '', postal: '' }],
    quote_delivery: [
      { address: '', city: '', state: '', country: '', postal: '', rate: '', currency: '', equipment: '', notes: '', packages: '', dimensions: '' },
    ],
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    if (quote) {
      const parsedPickups = Array.isArray(quote.quote_pickup) ? quote.quote_pickup : JSON.parse(quote.quote_pickup || '[]');
      const parsedDeliveries = Array.isArray(quote.quote_delivery) ? quote.quote_delivery : JSON.parse(quote.quote_delivery || '[]');
      setFormQuote({
        ...quote,
        quote_pickup: parsedPickups,
        quote_delivery: parsedDeliveries,
      });
    }
  }, [quote]);

  return (
    <div className="form-container">
      <form className="form-main">
        <ViewQuoteGeneral formQuote={formQuote} setFormQuote={setFormQuote} />
        <fieldset className="form-section">
          <legend>Pickup</legend>
          <div className="form-row">
            {formQuote.quote_pickup.map((pickup, index) => (
              <ViewQuotePickup key={index} formQuote={formQuote} setFormQuote={setFormQuote} pickup={pickup} index={index} />
            ))}
          </div>
        </fieldset>
        <fieldset className="form-section">
          <legend>Delivery</legend>
          <div className="form-row">
            {formQuote.quote_delivery.map((delivery, index) => (
              <ViewQuoteDelivery key={index} formQuote={formQuote} setFormQuote={setFormQuote} delivery={delivery} index={index} />
            ))}
          </div>
        </fieldset>
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewQuoteForm;
