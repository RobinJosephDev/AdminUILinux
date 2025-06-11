import '../../../styles/Form.css';
import EditDispatchDetails from './EditDispatchDetails';
import DispatchCharges from '../DispatchCharges';
import DispatchDiscounts from '../DispatchDiscounts';
import EditDispatchTax from './EditDispatchTax';
import { PlusOutlined } from '@ant-design/icons';
import { Dispatch, Charge } from '../../../types/DispatchTypes';

import useEditDispatch from '../../../hooks/edit/useEditDispatch';

interface EditDispatchFormProps {
  dispatch: Dispatch | null;
  onClose: () => void;
  onUpdate: (dispatch: Dispatch) => void;
}

const EditDispatchForm: React.FC<EditDispatchFormProps> = ({ dispatch, onClose, onUpdate }) => {
  const {
    formDispatch,
    setFormDispatch,
    updateDispatch,
    handleAddCharge,
    handleRemoveCharge,
    handleChargeChange,
    handleAddDiscount,
    handleRemoveDiscount,
    handleDiscountChange,
  } = useEditDispatch(dispatch, onClose, onUpdate);

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateDispatch();
        }}
        className="form-main"
      >
        {formDispatch && (
          <>
            <EditDispatchDetails formDispatch={formDispatch} setFormDispatch={setFormDispatch} />

            <fieldset className="form-section">
              <legend>Charges</legend>
              <hr />
              <div className="form-row">
                {formDispatch.charges.map((charge, index) => (
                  <DispatchCharges
                    dispatch={formDispatch}
                    setDispatch={setFormDispatch}
                    key={index}
                    charges={formDispatch.charges}
                    index={index}
                    onAddCharge={handleAddCharge}
                    handleChargeChange={handleChargeChange}
                    handleRemoveCharge={handleRemoveCharge}
                  />
                ))}
                {formDispatch.charges.length === 0 && (
                  <button type="button" onClick={handleAddCharge} className="add-button">
                    <PlusOutlined />
                  </button>
                )}
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>Discounts</legend>
              <hr />
              <div className="form-row">
                {formDispatch.discounts.map((discount, index) => (
                  <DispatchDiscounts
                    dispatch={formDispatch}
                    setDispatch={setFormDispatch}
                    key={index}
                    discounts={formDispatch.discounts}
                    index={index}
                    onAddDiscount={handleAddDiscount}
                    handleDiscountChange={handleDiscountChange}
                    handleRemoveDiscount={handleRemoveDiscount}
                  />
                ))}
                {formDispatch.discounts.length === 0 && (
                  <button type="button" onClick={handleAddDiscount} className="add-button">
                    <PlusOutlined />
                  </button>
                )}
              </div>
            </fieldset>
            <EditDispatchTax formDispatch={formDispatch} setFormDispatch={setFormDispatch} />
          </>
        )}
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Save
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDispatchForm;
