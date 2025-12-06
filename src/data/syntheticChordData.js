// Comprehensive synthetic data for chord diagram
// This creates a rich, realistic procurement hierarchy

export const generateChordData = () => {
  // Define the complete hierarchy
  const products = [
    // Fresh Produce
    { id: 'p1', name: 'Fresh Tomatoes', category: 'Fresh Produce', location: 'Downtown Hotel', function: 'Kitchen' },
    { id: 'p2', name: 'Organic Lettuce', category: 'Fresh Produce', location: 'Airport Restaurant', function: 'Kitchen' },
    { id: 'p3', name: 'Carrots', category: 'Fresh Produce', location: 'Beach Resort', function: 'Kitchen' },
    { id: 'p4', name: 'Broccoli', category: 'Fresh Produce', location: 'City Center Cafe', function: 'Kitchen' },
    
    // Dairy
    { id: 'p5', name: 'Whole Milk', category: 'Dairy', location: 'Downtown Hotel', function: 'Beverage' },
    { id: 'p6', name: 'Cheddar Cheese', category: 'Dairy', location: 'Beach Resort', function: 'Kitchen' },
    { id: 'p7', name: 'Yogurt', category: 'Dairy', location: 'City Center Cafe', function: 'Breakfast' },
    
    // Meat & Poultry
    { id: 'p8', name: 'Chicken Breast', category: 'Meat & Poultry', location: 'City Center Cafe', function: 'Kitchen' },
    { id: 'p9', name: 'Ground Beef', category: 'Meat & Poultry', location: 'Suburban Hotel', function: 'Kitchen' },
    { id: 'p10', name: 'Fish Fillet', category: 'Meat & Poultry', location: 'Beach Resort', function: 'Kitchen' },
    
    // Beverages
    { id: 'p11', name: 'Orange Juice', category: 'Beverages', location: 'Fine Dining', function: 'Beverage' },
    { id: 'p12', name: 'Coffee Beans', category: 'Beverages', location: 'Rooftop Bar', function: 'Beverage' },
    { id: 'p13', name: 'Red Wine', category: 'Beverages', location: 'Fine Dining', function: 'Bar' },
    
    // Pantry Items
    { id: 'p14', name: 'Olive Oil', category: 'Pantry Items', location: 'Downtown Hotel', function: 'Kitchen' },
    { id: 'p15', name: 'Rice', category: 'Pantry Items', location: 'Airport Restaurant', function: 'Kitchen' },
    
    // Frozen Foods
    { id: 'p16', name: 'Frozen Vegetables', category: 'Frozen Foods', location: 'Beach Resort', function: 'Kitchen' },
    { id: 'p17', name: 'Frozen Pizza', category: 'Frozen Foods', location: 'City Center Cafe', function: 'Kitchen' },
    
    // Bakery
    { id: 'p18', name: 'Sourdough Bread', category: 'Bakery', location: 'Suburban Hotel', function: 'Breakfast' },
    { id: 'p19', name: 'Croissants', category: 'Bakery', location: 'Fine Dining', function: 'Breakfast' },
    
    // Spices
    { id: 'p20', name: 'Black Pepper', category: 'Spices & Condiments', location: 'Rooftop Bar', function: 'Kitchen' },
  ];

  return {
    products,
    categories: ['Fresh Produce', 'Dairy', 'Meat & Poultry', 'Beverages', 'Pantry Items', 'Frozen Foods', 'Bakery', 'Spices & Condiments'],
    locations: ['Downtown Hotel', 'Airport Restaurant', 'Beach Resort', 'City Center Cafe', 'Suburban Hotel', 'Fine Dining', 'Rooftop Bar'],
    functions: ['Kitchen', 'Beverage', 'Breakfast', 'Bar'],
  };
};

// Create matrix data for D3 chord diagram
export const createChordMatrix = (products, level = 'category') => {
  const nodes = new Set();
  const connections = {};

  products.forEach((product) => {
    let source, target;

    switch (level) {
      case 'category':
        source = 'All Products';
        target = product.category;
        break;
      case 'location':
        source = product.category;
        target = product.location;
        break;
      case 'function':
        source = product.location;
        target = product.function;
        break;
      default:
        source = 'All Products';
        target = product.category;
    }

    nodes.add(source);
    nodes.add(target);

    const key = `${source}|${target}`;
    connections[key] = (connections[key] || 0) + 1;
  });

  const nodeArray = Array.from(nodes);
  const nodeIndex = Object.fromEntries(nodeArray.map((node, i) => [node, i]));

  // Create matrix
  const matrix = Array(nodeArray.length)
    .fill(null)
    .map(() => Array(nodeArray.length).fill(0));

  Object.entries(connections).forEach(([key, count]) => {
    const [source, target] = key.split('|');
    const sourceIdx = nodeIndex[source];
    const targetIdx = nodeIndex[target];
    if (sourceIdx !== undefined && targetIdx !== undefined) {
      matrix[sourceIdx][targetIdx] = count;
    }
  });

  return {
    matrix,
    nodes: nodeArray,
    connections,
  };
};
