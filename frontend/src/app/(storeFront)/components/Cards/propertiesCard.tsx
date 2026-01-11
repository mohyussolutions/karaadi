import React from "react";

interface Item {
  id: number;
  name: string;
}

interface PropertyCardProps {
  items: Item[];
}

const PropertyCard: React.FC<PropertyCardProps> = ({ items }) => (
  <div>
        <h2>Property Items</h2>
        
    <ul>
            
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
          
    </ul>
      
  </div>
);

export default PropertyCard;
