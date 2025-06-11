import { useEffect, useState, useContext } from 'react';
import ViewDispatchDetails from './ViewDispatchDetails';
import ViewDispatchCharges from './ViewDispatchCharges';
import ViewDispatchDiscounts from './ViewDispatchDiscounts';
import ViewDispatchTax from './ViewDispatchTax';
import { Dispatch } from '../../../types/DispatchTypes';

interface ViewDispatchFormProps {
  dispatch: Dispatch | null;
  onClose: () => void;
}

const ViewDispatchForm: React.FC<ViewDispatchFormProps> = ({ dispatch, onClose }) => {
  const [formDispatch, setFormDispatch] = useState<Dispatch>({
    id: 0,
    carrier: '',
    contact: '',
    equipment: '',
    driver_mobile: '',
    truck_unit_no: '',
    trailer_unit_no: '',
    paps_pars_no: '',
    tracking_code: '',
    border: '',
    currency: '',
    rate: '',
    charges: [],
    discounts: [],
    gst: '',
    pst: '',
    hst: '',
    qst: '',
    final_price: '',
    status: '',
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (dispatch) {
      setFormDispatch({
        ...dispatch,
        charges: Array.isArray(dispatch.charges) ? dispatch.charges : typeof dispatch.charges === 'string' ? JSON.parse(dispatch.charges) : [],

        discounts: Array.isArray(dispatch.discounts)
          ? dispatch.discounts
          : typeof dispatch.discounts === 'string'
          ? JSON.parse(dispatch.discounts)
          : [],
      });
    }
  }, [dispatch]);

  return (
    <div className="form-container">
      <form className="form-main">
        <ViewDispatchDetails formDispatch={formDispatch} />
        <fieldset className="form-section">
          <legend>Charges</legend>
          <hr />
          <div className="form-row">
            {formDispatch.charges.map((charge, index) => (
              <ViewDispatchCharges key={index} charge={charge} index={index} />
            ))}
          </div>
        </fieldset>
        <fieldset className="form-section">
          <legend>Discounts</legend>
          <hr />
          <div className="form-row">
            {formDispatch.discounts.map((discount, index) => (
              <ViewDispatchDiscounts key={index} discount={discount} index={index} />
            ))}
          </div>
        </fieldset>
        <ViewDispatchTax formDispatch={formDispatch} />

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose} style={{ padding: '9px 15px' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewDispatchForm;
