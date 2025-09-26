import React from 'react';

const PartCard = ({ part, actionLabel, onAction, showPurchased = false }) => {
  const img = part.images?.[0];
  const price = part.sellingPrice ?? part.price;
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="h-40 bg-gray-100 rounded mb-3 flex items-center justify-center overflow-hidden">
        {img ? <img src={img} alt={part.name} className="object-cover w-full h-full" /> : <span className="text-gray-500">No Image</span>}
      </div>
      <div className="font-semibold">{part.name}</div>
      <div className="text-sm text-gray-600">{part.carCompany?.name} • {part.carModel?.name} {part.carModel?.year}</div>
      <div className="mt-1">₹{price}</div>
      {showPurchased && part.purchasedPrice != null && (
        <div className="text-xs text-gray-500">Purchased: ₹{part.purchasedPrice}</div>
      )}
      {actionLabel && (
        <button onClick={onAction} className="mt-3 px-3 py-1 bg-gray-800 text-white rounded text-sm">{actionLabel}</button>
      )}
    </div>
  );
};

export default PartCard;
