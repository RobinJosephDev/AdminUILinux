import '../../../styles/Form.css';
import DispatchDetails from './DispatchDetails';
import DispatchCharges from '../DispatchCharges';
import DispatchDiscounts from '../DispatchDiscounts';
import DispatchTax from './DispatchTax';
import { PlusOutlined } from '@ant-design/icons';
import { useAddDispatch } from '../../../hooks/add/useAddDispatch';

interface AddDispatchFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddDispatchForm: React.FC<AddDispatchFormProps> = ({ onClose, onSuccess }) => {
  const {
    dispatch,
    setDispatch,
    handleSubmit,
    clearDispatchForm,
    handleAddCharge,
    handleChargeChange,
    handleRemoveCharge,
    handleAddDiscount,
    handleDiscountChange,
    handleRemoveDiscount,
  } = useAddDispatch(onClose, onSuccess);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-main">
        <DispatchDetails dispatch={dispatch} setDispatch={setDispatch} />
        <fieldset className="form-section">
          <legend>Charges</legend>
          <hr />
          <div className="form-row">
            {dispatch.charges.map((charge, index) => (
              <DispatchCharges
                dispatch={dispatch}
                setDispatch={setDispatch}
                key={index}
                charges={dispatch.charges}
                index={index}
                onAddCharge={handleAddCharge}
                handleChargeChange={handleChargeChange}
                handleRemoveCharge={handleRemoveCharge}
              />
            ))}
          </div>
          {dispatch.charges.length === 0 && (
            <button type="button" onClick={handleAddCharge} className="add-button">
              <PlusOutlined />
            </button>
          )}
        </fieldset>
        <fieldset className="form-section">
          <legend>Discounts</legend>
          <hr />
          <div className="form-row">
            {dispatch.discounts.map((discount, index) => (
              <DispatchDiscounts
                dispatch={dispatch}
                setDispatch={setDispatch}
                key={index}
                discounts={dispatch.discounts}
                index={index}
                onAddDiscount={handleAddDiscount}
                handleDiscountChange={handleDiscountChange}
                handleRemoveDiscount={handleRemoveDiscount}
              />
            ))}
          </div>
          {dispatch.discounts.length === 0 && (
            <button type="button" onClick={handleAddDiscount} className="add-button">
              <PlusOutlined />
            </button>
          )}
        </fieldset>

        <DispatchTax dispatch={dispatch} setDispatch={setDispatch} />

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Dispatch
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDispatchForm;
