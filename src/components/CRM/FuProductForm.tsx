import { DeleteOutlined } from '@ant-design/icons';
import { ChangeEvent, useCallback } from 'react';
import { Product } from '../../types/FollowupTypes';

// Define Props
interface FuProductFormProps {
  product: Product; // Product object
  onAddProduct: () => void;
  handleRemoveProduct: (id: number) => void;
  handleProductChange: (id: number, updatedProduct: Product) => void;
}

// Input Sanitization
const sanitizeInput = (value: string, type: 'text' | 'number') => {
  if (type === 'text') {
    return value.replace(/[^a-zA-Z0-9\s\-,._]/g, ''); // Allow letters, numbers, spaces, and basic punctuation
  }
  if (type === 'number') {
    return value.replace(/[^0-9]/g, ''); // Allow only digits
  }
  return value;
};

const FuProductForm: React.FC<FuProductFormProps> = ({ product, handleProductChange, handleRemoveProduct }) => {
  const handleInputChange = useCallback(
    (field: keyof Product) => (e: ChangeEvent<HTMLInputElement>) => {
      let sanitizedValue = sanitizeInput(e.target.value, field === 'quantity' ? 'number' : 'text');

      // Ensure quantity is always at least 1
      if (field === 'quantity' && Number(sanitizedValue) < 1) {
        sanitizedValue = '1';
      }

      handleProductChange(Number(product.id), { ...product, [field]: sanitizedValue });
    },
    [product, handleProductChange]
  );

  return (
    <div className="product-form">
      <div className="form-group">
        <label>Name</label>
        <input id={`name-${product.id}`} type="text" name="name" value={product.name || ''} onChange={handleInputChange('name')} />
      </div>
      <div className="form-group">
        <label>Quantity</label>
        <input id={`quantity-${product.id}`} type="number" name="quantity" value={product.quantity || ''} onChange={handleInputChange('quantity')} />
      </div>

      <button type="button" onClick={() => handleRemoveProduct(Number(product.id))} className="remove">
        <DeleteOutlined />
      </button>
    </div>
  );
};

export default FuProductForm;
