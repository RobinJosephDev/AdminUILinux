import ViewOrderGeneral from './ViewOrderGeneral';
import ViewOrderShipment from './ViewOrderShipment';
import ViewOrderOrigin from './ViewOrderOrigin';
import ViewOrderDestination from './ViewOrderDestination';
import ViewOrderSpecs from './ViewOrderSpecs';
import ViewOrderRevenue from './ViewOrderRevenue';
import ViewOrderCharges from './ViewOrderCharges';
import ViewOrderDiscounts from './ViewOrderDiscounts';
import ViewOrderTax from './ViewOrderTax';
import useOrderHandler from './useOrderHandler';
import useOrderDetails from './useOrderDetails';

const ViewOrderForm = ({ order, onClose }) => {
  const { formOrder, setFormOrder } = useOrderHandler({ order, onClose });

  const {
    handleOriginChange,
    handleDestinationChange,
    handleChargeChange,
    handleDiscountChange,
    handleRemoveOrigin,
    handleRemoveDestination,
    handleRemoveCharge,
    handleRemoveDiscount,
  } = useOrderDetails();

  return (
    <div className="form-container">
      <form
        className="form-main"
      >
        <ViewOrderGeneral formOrder={formOrder} setFormOrder={setFormOrder} />
        <ViewOrderShipment formOrder={formOrder} setFormOrder={setFormOrder} />
        <fieldset className="form-section">
          <legend>Origin</legend>
          <div className="form-row">
            {formOrder.origin_location.map((origin, index) => (
              <ViewOrderOrigin
                key={index}
                formOrder={formOrder}
                setFormOrder={setFormOrder}
                origin={origin}
                index={index}
                onChange={handleOriginChange}
                onRemove={handleRemoveOrigin}
              />
            ))}

          </div>
        </fieldset>
        <fieldset className="form-section">
          <legend>Destination</legend>
          <div className="form-row">
            {formOrder.destination_location.map((destination, index) => (
              <ViewOrderDestination
                key={index}
                formOrder={formOrder}
                setFormOrder={setFormOrder}
                destination={destination}
                index={index}
                onChange={handleDestinationChange}
                onRemove={handleRemoveDestination}
              />
            ))}
 
          </div>
        </fieldset>
        <ViewOrderSpecs formOrder={formOrder} setFormOrder={setFormOrder} />
        <ViewOrderRevenue formOrder={formOrder} setFormOrder={setFormOrder} />

        <fieldset className="form-section">
          <legend>Charges</legend>
          <div className="form-row">
            {formOrder.charges.map((charge, index) => (
              <ViewOrderCharges
                key={index}
                formOrder={formOrder}
                setFormOrder={setFormOrder}
                charge={charge}
                index={index}
                onChange={handleChargeChange}
                onRemove={handleRemoveCharge}
              />
            ))}

          </div>
        </fieldset>
        <fieldset className="form-section">
          <legend>Discounts</legend>
          <div className="form-row">
            {formOrder.discounts.map((discount, index) => (
              <ViewOrderDiscounts
                key={index}
                formOrder={formOrder}
                setFormOrder={setFormOrder}
                discount={discount}
                index={index}
                onChange={handleDiscountChange}
                onRemove={handleRemoveDiscount}
              />
            ))}

          </div>
        </fieldset>
        <ViewOrderTax formOrder={formOrder} setFormOrder={setFormOrder} />
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewOrderForm;
