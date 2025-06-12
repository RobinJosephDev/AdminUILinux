import { useEffect, useState } from 'react';
import axios from 'axios';

interface Carrier {
  value: string;
  label: string;
}

interface FormDispatch {
  carrier?: string;
  contact?: string;
  equipment?: string;
  driver_mobile?: string;
  truck_unit_no?: string;
  trailer_unit_no?: string;
  paps_pars_no?: string;
  tracking_code?: string;
  border?: string;
  currency?: string;
}

interface ViewDispatchDetailsProps {
  formDispatch: FormDispatch;
}

const ViewDispatchDetails: React.FC<ViewDispatchDetailsProps> = ({ formDispatch }) => {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const fetchCarriers = async () => {
      try {
        const token = localStorage.getItem('token');

        const { data } = await axios.get<Carrier[]>(`${API_URL}/carrier`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Fetched carriers:', data);

        const formattedCustomers = data.map((carrier) => ({
          value: carrier.value,
          label: carrier.label,
        }));

        setCarriers(formattedCustomers);
      } catch (error) {
        console.error('Error fetching carriers:', error);
      }
    };

    fetchCarriers();
  }, []);

  return (
    <fieldset className="form-section">
      <legend>General</legend>

      <hr />

      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="customer">Carrier</label>
          <div>{formDispatch.carrier}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="customerRefNo">Contact</label>
          <div>{formDispatch.contact}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="remitName">Equipment</label>
          <div>{formDispatch.equipment}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="accNo">Driver cell</label>
          <div>{formDispatch.driver_mobile}</div>
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="branch">Truck unit#</label>
          <div>{formDispatch.truck_unit_no}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="website">Trailer unit#</label>
          <div>{formDispatch.trailer_unit_no}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="fedIdNo">PAPS/PARS#</label>
          <div>{formDispatch.paps_pars_no}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="website">Tracking code</label>
          <div>{formDispatch.tracking_code}</div>
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="fedIdNo">Border</label>
          <div>{formDispatch.border}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="fedIdNo">Currency</label>
          <div>{formDispatch.currency}</div>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewDispatchDetails;
