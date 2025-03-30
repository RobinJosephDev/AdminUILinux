import React from 'react';

type Quote = {
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
};

type ViewQuoteGeneralProps = {
  formQuote: Quote;
};

const ViewQuoteGeneral: React.FC<ViewQuoteGeneralProps> = ({ formQuote }) => {
  return (
    <fieldset className="form-section">
      <legend>General</legend>
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Quote Type</label>
          <div>{formQuote.quote_type || 'N/A'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Customer</label>
          <div>{formQuote.quote_customer || 'N/A'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Customer Ref. No</label>
          <div>{formQuote.quote_cust_ref_no || 'N/A'}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Booked By</label>
          <div>{formQuote.quote_booked_by || 'N/A'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Temperature</label>
          <div>{formQuote.quote_temperature || 'N/A'}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Hot</label>
          <div>{formQuote.quote_hot ? 'Yes' : 'No'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Team</label>
          <div>{formQuote.quote_team ? 'Yes' : 'No'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Air Ride</label>
          <div>{formQuote.quote_air_ride ? 'Yes' : 'No'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>TARP</label>
          <div>{formQuote.quote_tarp ? 'Yes' : 'No'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Hazmat</label>
          <div>{formQuote.quote_hazmat ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewQuoteGeneral;
