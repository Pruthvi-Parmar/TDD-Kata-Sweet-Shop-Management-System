import { Sweet } from '../../types';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: string) => void;
}

const SweetCard = ({ sweet, onPurchase }: SweetCardProps) => {
  const isOutOfStock = sweet.quantity === 0;

  const handlePurchase = () => {
    if (!isOutOfStock) {
      onPurchase(sweet._id);
    }
  };

  return (
    <div className="sweet-card">
      {sweet.imageUrl && (
        <img src={sweet.imageUrl} alt={sweet.name} className="sweet-image" />
      )}
      <div className="sweet-content">
        <h3 className="sweet-name">{sweet.name}</h3>
        <p className="sweet-description">{sweet.description}</p>
        <span className="sweet-category">{sweet.category}</span>
        <div className="sweet-footer">
          <span className="sweet-price">${sweet.price.toFixed(2)}</span>
          <span className={`sweet-stock ${isOutOfStock ? 'out-of-stock' : ''}`}>
            {isOutOfStock ? 'Out of stock' : `${sweet.quantity} in stock`}
          </span>
        </div>
        <button
          className={`btn-purchase ${isOutOfStock ? 'disabled' : ''}`}
          onClick={handlePurchase}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
        </button>
      </div>
    </div>
  );
};

export default SweetCard;

