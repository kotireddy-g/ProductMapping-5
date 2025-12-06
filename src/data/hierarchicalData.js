export const hierarchicalProductData = {
  hospitality: {
    categories: [
      {
        id: 'fresh-produce',
        name: 'Fresh Produce',
        movement: 'fast',
        totalVolume: 610,
        consumption: 'over',
        subcategories: [
          {
            id: 'vegetables',
            name: 'Vegetables',
            movement: 'fast',
            parentId: 'fresh-produce',
            totalVolume: 350,
            consumption: 'over',
            connectedAreas: ['downtown-hotel', 'beach-resort', 'airport-restaurant', 'fine-dining'],
            areaFlows: {
              'downtown-hotel': { volume: 100, consumption: 'normal' },
              'beach-resort': { volume: 120, consumption: 'over' },
              'airport-restaurant': { volume: 60, consumption: 'under' },
              'fine-dining': { volume: 70, consumption: 'normal' }
            },
            types: [
              {
                id: 'leafy-greens',
                name: 'Leafy Greens',
                movement: 'fast',
                parentId: 'vegetables',
                totalVolume: 180,
                consumption: 'over',
                connectedAreas: ['downtown-hotel', 'beach-resort', 'fine-dining'],
                areaFlows: {
                  'downtown-hotel': { volume: 60, consumption: 'normal' },
                  'beach-resort': { volume: 70, consumption: 'over' },
                  'fine-dining': { volume: 50, consumption: 'normal' }
                },
                brands: [
                  {
                    id: 'farm-fresh',
                    name: 'Farm Fresh',
                    movement: 'fast',
                    parentId: 'leafy-greens',
                    totalVolume: 120,
                    consumption: 'over',
                    connectedAreas: ['downtown-hotel', 'beach-resort'],
                    areaFlows: {
                      'downtown-hotel': { volume: 50, consumption: 'normal' },
                      'beach-resort': { volume: 70, consumption: 'over' }
                    },
                    products: [
                      { id: 'organic-lettuce', name: 'Organic Lettuce', movement: 'fast', totalVolume: 70, consumption: 'over', connectedAreas: ['downtown-hotel', 'beach-resort'], areaFlows: { 'downtown-hotel': { volume: 30, consumption: 'normal' }, 'beach-resort': { volume: 40, consumption: 'over' } } },
                      { id: 'spinach', name: 'Spinach', movement: 'fast', totalVolume: 35, consumption: 'normal', connectedAreas: ['downtown-hotel'], areaFlows: { 'downtown-hotel': { volume: 35, consumption: 'normal' } } },
                      { id: 'kale', name: 'Kale', movement: 'medium', totalVolume: 15, consumption: 'under', connectedAreas: ['beach-resort'], areaFlows: { 'beach-resort': { volume: 15, consumption: 'under' } } }
                    ]
                  },
                  {
                    id: 'green-garden',
                    name: 'Green Garden',
                    movement: 'medium',
                    parentId: 'leafy-greens',
                    totalVolume: 60,
                    consumption: 'normal',
                    connectedAreas: ['fine-dining'],
                    areaFlows: { 'fine-dining': { volume: 60, consumption: 'normal' } },
                    products: [
                      { id: 'arugula', name: 'Arugula', movement: 'medium', totalVolume: 25, consumption: 'normal', connectedAreas: ['fine-dining'], areaFlows: { 'fine-dining': { volume: 25, consumption: 'normal' } } },
                      { id: 'mixed-greens', name: 'Mixed Greens', movement: 'fast', totalVolume: 35, consumption: 'over', connectedAreas: ['fine-dining'], areaFlows: { 'fine-dining': { volume: 35, consumption: 'over' } } }
                    ]
                  }
                ]
              },
              {
                id: 'root-vegetables',
                name: 'Root Vegetables',
                movement: 'medium',
                parentId: 'vegetables',
                totalVolume: 170,
                consumption: 'normal',
                connectedAreas: ['downtown-hotel', 'airport-restaurant'],
                areaFlows: {
                  'downtown-hotel': { volume: 90, consumption: 'normal' },
                  'airport-restaurant': { volume: 80, consumption: 'normal' }
                },
                brands: [
                  {
                    id: 'organic-farms',
                    name: 'Organic Farms',
                    movement: 'medium',
                    parentId: 'root-vegetables',
                    totalVolume: 170,
                    consumption: 'normal',
                    connectedAreas: ['downtown-hotel', 'airport-restaurant'],
                    areaFlows: { 'downtown-hotel': { volume: 90, consumption: 'normal' }, 'airport-restaurant': { volume: 80, consumption: 'normal' } },
                    products: [
                      { id: 'carrots', name: 'Carrots', movement: 'medium', totalVolume: 50, consumption: 'normal', connectedAreas: ['downtown-hotel'], areaFlows: { 'downtown-hotel': { volume: 50, consumption: 'normal' } } },
                      { id: 'potatoes', name: 'Potatoes', movement: 'fast', totalVolume: 80, consumption: 'over', connectedAreas: ['downtown-hotel', 'airport-restaurant'], areaFlows: { 'downtown-hotel': { volume: 40, consumption: 'over' }, 'airport-restaurant': { volume: 40, consumption: 'normal' } } },
                      { id: 'onions', name: 'Onions', movement: 'fast', totalVolume: 40, consumption: 'normal', connectedAreas: ['airport-restaurant'], areaFlows: { 'airport-restaurant': { volume: 40, consumption: 'normal' } } }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'fruits',
            name: 'Fruits',
            movement: 'fast',
            parentId: 'fresh-produce',
            totalVolume: 260,
            consumption: 'normal',
            connectedAreas: ['downtown-hotel', 'beach-resort', 'city-cafe'],
            areaFlows: {
              'downtown-hotel': { volume: 90, consumption: 'normal' },
              'beach-resort': { volume: 100, consumption: 'over' },
              'city-cafe': { volume: 70, consumption: 'normal' }
            },
            types: [
              {
                id: 'tropical-fruits',
                name: 'Tropical Fruits',
                movement: 'medium',
                parentId: 'fruits',
                totalVolume: 100,
                consumption: 'normal',
                connectedAreas: ['beach-resort'],
                areaFlows: { 'beach-resort': { volume: 100, consumption: 'normal' } },
                brands: [
                  {
                    id: 'sun-ripe',
                    name: 'Sun Ripe',
                    movement: 'medium',
                    parentId: 'tropical-fruits',
                    totalVolume: 100,
                    consumption: 'normal',
                    connectedAreas: ['beach-resort'],
                    areaFlows: { 'beach-resort': { volume: 100, consumption: 'normal' } },
                    products: [
                      { id: 'mangoes', name: 'Mangoes', movement: 'medium', totalVolume: 60, consumption: 'normal', connectedAreas: ['beach-resort'], areaFlows: { 'beach-resort': { volume: 60, consumption: 'normal' } } },
                      { id: 'pineapples', name: 'Pineapples', movement: 'slow', totalVolume: 40, consumption: 'under', connectedAreas: ['beach-resort'], areaFlows: { 'beach-resort': { volume: 40, consumption: 'under' } } }
                    ]
                  }
                ]
              },
              {
                id: 'berries',
                name: 'Berries',
                movement: 'fast',
                parentId: 'fruits',
                totalVolume: 160,
                consumption: 'over',
                connectedAreas: ['downtown-hotel', 'city-cafe'],
                areaFlows: { 'downtown-hotel': { volume: 90, consumption: 'over' }, 'city-cafe': { volume: 70, consumption: 'normal' } },
                brands: [
                  {
                    id: 'berry-best',
                    name: 'Berry Best',
                    movement: 'fast',
                    parentId: 'berries',
                    totalVolume: 160,
                    consumption: 'over',
                    connectedAreas: ['downtown-hotel', 'city-cafe'],
                    areaFlows: { 'downtown-hotel': { volume: 90, consumption: 'over' }, 'city-cafe': { volume: 70, consumption: 'normal' } },
                    products: [
                      { id: 'strawberries', name: 'Strawberries', movement: 'fast', totalVolume: 100, consumption: 'over', connectedAreas: ['downtown-hotel', 'city-cafe'], areaFlows: { 'downtown-hotel': { volume: 60, consumption: 'over' }, 'city-cafe': { volume: 40, consumption: 'normal' } } },
                      { id: 'blueberries', name: 'Blueberries', movement: 'fast', totalVolume: 60, consumption: 'normal', connectedAreas: ['downtown-hotel', 'city-cafe'], areaFlows: { 'downtown-hotel': { volume: 30, consumption: 'normal' }, 'city-cafe': { volume: 30, consumption: 'normal' } } }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        connectedAreas: ['downtown-hotel', 'beach-resort', 'airport-restaurant', 'fine-dining', 'city-cafe'],
        areaFlows: {
          'downtown-hotel': { volume: 150, consumption: 'normal' },
          'beach-resort': { volume: 200, consumption: 'over' },
          'airport-restaurant': { volume: 80, consumption: 'under' },
          'fine-dining': { volume: 120, consumption: 'normal' },
          'city-cafe': { volume: 60, consumption: 'normal' }
        }
      },
      {
        id: 'dairy',
        name: 'Dairy',
        movement: 'fast',
        totalVolume: 595,
        consumption: 'over',
        subcategories: [
          {
            id: 'milk-products',
            name: 'Milk Products',
            movement: 'fast',
            parentId: 'dairy',
            totalVolume: 350,
            consumption: 'over',
            connectedAreas: ['downtown-hotel', 'beach-resort', 'suburban-hotel', 'city-cafe'],
            areaFlows: {
              'downtown-hotel': { volume: 100, consumption: 'over' },
              'beach-resort': { volume: 90, consumption: 'normal' },
              'suburban-hotel': { volume: 80, consumption: 'normal' },
              'city-cafe': { volume: 80, consumption: 'over' }
            },
            types: [
              {
                id: 'fresh-milk',
                name: 'Fresh Milk',
                movement: 'fast',
                parentId: 'milk-products',
                totalVolume: 220,
                consumption: 'over',
                connectedAreas: ['downtown-hotel', 'beach-resort', 'city-cafe'],
                areaFlows: { 'downtown-hotel': { volume: 80, consumption: 'over' }, 'beach-resort': { volume: 70, consumption: 'normal' }, 'city-cafe': { volume: 70, consumption: 'over' } },
                brands: [
                  {
                    id: 'farm-dairy',
                    name: 'Farm Dairy',
                    movement: 'fast',
                    parentId: 'fresh-milk',
                    totalVolume: 220,
                    consumption: 'over',
                    connectedAreas: ['downtown-hotel', 'beach-resort', 'city-cafe'],
                    areaFlows: { 'downtown-hotel': { volume: 80, consumption: 'over' }, 'beach-resort': { volume: 70, consumption: 'normal' }, 'city-cafe': { volume: 70, consumption: 'over' } },
                    products: [
                      { id: 'whole-milk', name: 'Whole Milk', movement: 'fast', totalVolume: 150, consumption: 'over', connectedAreas: ['downtown-hotel', 'beach-resort', 'city-cafe'], areaFlows: { 'downtown-hotel': { volume: 60, consumption: 'over' }, 'beach-resort': { volume: 50, consumption: 'normal' }, 'city-cafe': { volume: 40, consumption: 'over' } } },
                      { id: 'skim-milk', name: 'Skim Milk', movement: 'medium', totalVolume: 70, consumption: 'normal', connectedAreas: ['downtown-hotel', 'city-cafe'], areaFlows: { 'downtown-hotel': { volume: 40, consumption: 'normal' }, 'city-cafe': { volume: 30, consumption: 'normal' } } }
                    ]
                  }
                ]
              },
              {
                id: 'cream',
                name: 'Cream',
                movement: 'medium',
                parentId: 'milk-products',
                totalVolume: 130,
                consumption: 'normal',
                connectedAreas: ['suburban-hotel', 'beach-resort'],
                areaFlows: { 'suburban-hotel': { volume: 80, consumption: 'normal' }, 'beach-resort': { volume: 50, consumption: 'normal' } },
                brands: [
                  {
                    id: 'premium-dairy',
                    name: 'Premium Dairy',
                    movement: 'medium',
                    parentId: 'cream',
                    totalVolume: 130,
                    consumption: 'normal',
                    connectedAreas: ['suburban-hotel', 'beach-resort'],
                    areaFlows: { 'suburban-hotel': { volume: 80, consumption: 'normal' }, 'beach-resort': { volume: 50, consumption: 'normal' } },
                    products: [
                      { id: 'heavy-cream', name: 'Heavy Cream', movement: 'medium', totalVolume: 80, consumption: 'normal', connectedAreas: ['suburban-hotel'], areaFlows: { 'suburban-hotel': { volume: 80, consumption: 'normal' } } },
                      { id: 'whipping-cream', name: 'Whipping Cream', movement: 'slow', totalVolume: 50, consumption: 'under', connectedAreas: ['beach-resort'], areaFlows: { 'beach-resort': { volume: 50, consumption: 'under' } } }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'cheese',
            name: 'Cheese',
            movement: 'medium',
            parentId: 'dairy',
            totalVolume: 245,
            consumption: 'normal',
            connectedAreas: ['fine-dining', 'rooftop-bar', 'conference-center'],
            areaFlows: {
              'fine-dining': { volume: 100, consumption: 'normal' },
              'rooftop-bar': { volume: 75, consumption: 'over' },
              'conference-center': { volume: 70, consumption: 'normal' }
            },
            types: [
              {
                id: 'hard-cheese',
                name: 'Hard Cheese',
                movement: 'slow',
                parentId: 'cheese',
                totalVolume: 120,
                consumption: 'under',
                connectedAreas: ['fine-dining', 'conference-center'],
                areaFlows: { 'fine-dining': { volume: 70, consumption: 'normal' }, 'conference-center': { volume: 50, consumption: 'under' } },
                brands: [
                  {
                    id: 'artisan-cheese',
                    name: 'Artisan Cheese',
                    movement: 'slow',
                    parentId: 'hard-cheese',
                    totalVolume: 120,
                    consumption: 'under',
                    connectedAreas: ['fine-dining', 'conference-center'],
                    areaFlows: { 'fine-dining': { volume: 70, consumption: 'normal' }, 'conference-center': { volume: 50, consumption: 'under' } },
                    products: [
                      { id: 'cheddar', name: 'Cheddar', movement: 'medium', totalVolume: 70, consumption: 'normal', connectedAreas: ['fine-dining'], areaFlows: { 'fine-dining': { volume: 70, consumption: 'normal' } } },
                      { id: 'parmesan', name: 'Parmesan', movement: 'slow', totalVolume: 50, consumption: 'under', connectedAreas: ['conference-center'], areaFlows: { 'conference-center': { volume: 50, consumption: 'under' } } }
                    ]
                  }
                ]
              },
              {
                id: 'soft-cheese',
                name: 'Soft Cheese',
                movement: 'medium',
                parentId: 'cheese',
                totalVolume: 125,
                consumption: 'over',
                connectedAreas: ['fine-dining', 'rooftop-bar'],
                areaFlows: { 'fine-dining': { volume: 50, consumption: 'normal' }, 'rooftop-bar': { volume: 75, consumption: 'over' } },
                brands: [
                  {
                    id: 'gourmet-cheese',
                    name: 'Gourmet Cheese',
                    movement: 'medium',
                    parentId: 'soft-cheese',
                    totalVolume: 125,
                    consumption: 'over',
                    connectedAreas: ['fine-dining', 'rooftop-bar'],
                    areaFlows: { 'fine-dining': { volume: 50, consumption: 'normal' }, 'rooftop-bar': { volume: 75, consumption: 'over' } },
                    products: [
                      { id: 'brie', name: 'Brie', movement: 'occasional', totalVolume: 30, consumption: 'under', connectedAreas: ['fine-dining'], areaFlows: { 'fine-dining': { volume: 30, consumption: 'under' } } },
                      { id: 'mozzarella', name: 'Mozzarella', movement: 'fast', totalVolume: 95, consumption: 'over', connectedAreas: ['fine-dining', 'rooftop-bar'], areaFlows: { 'fine-dining': { volume: 40, consumption: 'normal' }, 'rooftop-bar': { volume: 55, consumption: 'over' } } }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        connectedAreas: ['downtown-hotel', 'beach-resort', 'airport-restaurant', 'rooftop-bar', 'suburban-hotel', 'city-cafe', 'fine-dining', 'conference-center'],
        areaFlows: {
          'downtown-hotel': { volume: 180, consumption: 'over' },
          'beach-resort': { volume: 160, consumption: 'normal' },
          'airport-restaurant': { volume: 70, consumption: 'under' },
          'rooftop-bar': { volume: 40, consumption: 'normal' },
          'suburban-hotel': { volume: 90, consumption: 'normal' },
          'city-cafe': { volume: 55, consumption: 'normal' }
        }
      },
      {
        id: 'meat-poultry',
        name: 'Meat & Poultry',
        movement: 'fast',
        totalVolume: 630,
        consumption: 'over',
        connectedAreas: ['downtown-hotel', 'beach-resort', 'fine-dining', 'suburban-hotel'],
        areaFlows: {
          'downtown-hotel': { volume: 200, consumption: 'over' },
          'beach-resort': { volume: 180, consumption: 'normal' },
          'fine-dining': { volume: 150, consumption: 'over' },
          'suburban-hotel': { volume: 100, consumption: 'under' }
        },
        subcategories: [
          {
            id: 'poultry',
            name: 'Poultry',
            movement: 'fast',
            parentId: 'meat-poultry',
            totalVolume: 380,
            consumption: 'over',
            connectedAreas: ['downtown-hotel', 'beach-resort', 'airport-restaurant'],
            areaFlows: { 'downtown-hotel': { volume: 150, consumption: 'over' }, 'beach-resort': { volume: 130, consumption: 'normal' }, 'airport-restaurant': { volume: 100, consumption: 'normal' } },
            types: [
              {
                id: 'chicken',
                name: 'Chicken',
                movement: 'fast',
                parentId: 'poultry',
                totalVolume: 380,
                consumption: 'over',
                connectedAreas: ['downtown-hotel', 'beach-resort', 'airport-restaurant'],
                areaFlows: { 'downtown-hotel': { volume: 150, consumption: 'over' }, 'beach-resort': { volume: 130, consumption: 'normal' }, 'airport-restaurant': { volume: 100, consumption: 'normal' } },
                brands: [
                  {
                    id: 'prime-poultry',
                    name: 'Prime Poultry',
                    movement: 'fast',
                    parentId: 'chicken',
                    totalVolume: 380,
                    consumption: 'over',
                    connectedAreas: ['downtown-hotel', 'beach-resort', 'airport-restaurant'],
                    areaFlows: { 'downtown-hotel': { volume: 150, consumption: 'over' }, 'beach-resort': { volume: 130, consumption: 'normal' }, 'airport-restaurant': { volume: 100, consumption: 'normal' } },
                    products: [
                      { id: 'chicken-breast', name: 'Chicken Breast', movement: 'fast', totalVolume: 250, consumption: 'over', connectedAreas: ['downtown-hotel', 'beach-resort'], areaFlows: { 'downtown-hotel': { volume: 130, consumption: 'over' }, 'beach-resort': { volume: 120, consumption: 'normal' } } },
                      { id: 'chicken-thighs', name: 'Chicken Thighs', movement: 'medium', totalVolume: 130, consumption: 'normal', connectedAreas: ['airport-restaurant'], areaFlows: { 'airport-restaurant': { volume: 130, consumption: 'normal' } } }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'red-meat',
            name: 'Red Meat',
            movement: 'medium',
            parentId: 'meat-poultry',
            totalVolume: 250,
            consumption: 'normal',
            connectedAreas: ['fine-dining', 'beach-resort', 'suburban-hotel'],
            areaFlows: { 'fine-dining': { volume: 120, consumption: 'over' }, 'beach-resort': { volume: 80, consumption: 'normal' }, 'suburban-hotel': { volume: 50, consumption: 'under' } },
            types: [
              {
                id: 'beef',
                name: 'Beef',
                movement: 'medium',
                parentId: 'red-meat',
                totalVolume: 250,
                consumption: 'normal',
                connectedAreas: ['fine-dining', 'beach-resort', 'suburban-hotel'],
                areaFlows: { 'fine-dining': { volume: 120, consumption: 'over' }, 'beach-resort': { volume: 80, consumption: 'normal' }, 'suburban-hotel': { volume: 50, consumption: 'under' } },
                brands: [
                  {
                    id: 'premium-beef',
                    name: 'Premium Beef',
                    movement: 'medium',
                    parentId: 'beef',
                    totalVolume: 250,
                    consumption: 'normal',
                    connectedAreas: ['fine-dining', 'beach-resort', 'suburban-hotel'],
                    areaFlows: { 'fine-dining': { volume: 120, consumption: 'over' }, 'beach-resort': { volume: 80, consumption: 'normal' }, 'suburban-hotel': { volume: 50, consumption: 'under' } },
                    products: [
                      { id: 'ribeye', name: 'Ribeye Steak', movement: 'slow', totalVolume: 80, consumption: 'normal', connectedAreas: ['fine-dining'], areaFlows: { 'fine-dining': { volume: 80, consumption: 'normal' } } },
                      { id: 'ground-beef', name: 'Ground Beef', movement: 'fast', totalVolume: 170, consumption: 'over', connectedAreas: ['beach-resort', 'suburban-hotel'], areaFlows: { 'beach-resort': { volume: 100, consumption: 'over' }, 'suburban-hotel': { volume: 70, consumption: 'normal' } } }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'beverages',
        name: 'Beverages',
        movement: 'fast',
        totalVolume: 1250,
        consumption: 'over',
        connectedAreas: ['downtown-hotel', 'beach-resort', 'rooftop-bar', 'conference-center', 'city-cafe'],
        areaFlows: {
          'downtown-hotel': { volume: 250, consumption: 'over' },
          'beach-resort': { volume: 300, consumption: 'over' },
          'rooftop-bar': { volume: 400, consumption: 'over' },
          'conference-center': { volume: 180, consumption: 'normal' },
          'city-cafe': { volume: 120, consumption: 'normal' }
        },
        subcategories: [
          {
            id: 'alcoholic',
            name: 'Alcoholic',
            movement: 'medium',
            parentId: 'beverages',
            totalVolume: 600,
            consumption: 'normal',
            connectedAreas: ['rooftop-bar', 'fine-dining', 'beach-resort'],
            areaFlows: { 'rooftop-bar': { volume: 300, consumption: 'over' }, 'fine-dining': { volume: 150, consumption: 'normal' }, 'beach-resort': { volume: 150, consumption: 'normal' } },
            types: [
              {
                id: 'wines',
                name: 'Wines',
                movement: 'medium',
                parentId: 'alcoholic',
                totalVolume: 350,
                consumption: 'normal',
                connectedAreas: ['rooftop-bar', 'fine-dining'],
                areaFlows: { 'rooftop-bar': { volume: 180, consumption: 'normal' }, 'fine-dining': { volume: 170, consumption: 'normal' } },
                brands: [
                  {
                    id: 'vineyard-select',
                    name: 'Vineyard Select',
                    movement: 'medium',
                    parentId: 'wines',
                    totalVolume: 350,
                    consumption: 'normal',
                    connectedAreas: ['rooftop-bar', 'fine-dining'],
                    areaFlows: { 'rooftop-bar': { volume: 180, consumption: 'normal' }, 'fine-dining': { volume: 170, consumption: 'normal' } },
                    products: [
                      { id: 'red-wine', name: 'Red Wine', movement: 'medium', totalVolume: 200, consumption: 'normal', connectedAreas: ['rooftop-bar', 'fine-dining'], areaFlows: { 'rooftop-bar': { volume: 100, consumption: 'normal' }, 'fine-dining': { volume: 100, consumption: 'normal' } } },
                      { id: 'white-wine', name: 'White Wine', movement: 'medium', totalVolume: 150, consumption: 'normal', connectedAreas: ['rooftop-bar', 'fine-dining'], areaFlows: { 'rooftop-bar': { volume: 80, consumption: 'normal' }, 'fine-dining': { volume: 70, consumption: 'normal' } } }
                    ]
                  }
                ]
              },
              {
                id: 'spirits',
                name: 'Spirits',
                movement: 'slow',
                parentId: 'alcoholic',
                totalVolume: 250,
                consumption: 'under',
                connectedAreas: ['rooftop-bar', 'beach-resort'],
                areaFlows: { 'rooftop-bar': { volume: 150, consumption: 'normal' }, 'beach-resort': { volume: 100, consumption: 'under' } },
                brands: [
                  {
                    id: 'craft-spirits',
                    name: 'Craft Spirits',
                    movement: 'slow',
                    parentId: 'spirits',
                    totalVolume: 250,
                    consumption: 'under',
                    connectedAreas: ['rooftop-bar', 'beach-resort'],
                    areaFlows: { 'rooftop-bar': { volume: 150, consumption: 'normal' }, 'beach-resort': { volume: 100, consumption: 'under' } },
                    products: [
                      { id: 'vodka', name: 'Vodka', movement: 'medium', totalVolume: 150, consumption: 'normal', connectedAreas: ['rooftop-bar'], areaFlows: { 'rooftop-bar': { volume: 150, consumption: 'normal' } } },
                      { id: 'whiskey', name: 'Whiskey', movement: 'slow', totalVolume: 100, consumption: 'under', connectedAreas: ['beach-resort'], areaFlows: { 'beach-resort': { volume: 100, consumption: 'under' } } }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'non-alcoholic',
            name: 'Non-Alcoholic',
            movement: 'fast',
            parentId: 'beverages',
            totalVolume: 650,
            consumption: 'over',
            connectedAreas: ['downtown-hotel', 'airport-restaurant', 'city-cafe', 'conference-center'],
            areaFlows: { 'downtown-hotel': { volume: 200, consumption: 'over' }, 'airport-restaurant': { volume: 150, consumption: 'normal' }, 'city-cafe': { volume: 180, consumption: 'over' }, 'conference-center': { volume: 120, consumption: 'normal' } },
            types: [
              {
                id: 'juices',
                name: 'Juices',
                movement: 'fast',
                parentId: 'non-alcoholic',
                totalVolume: 350,
                consumption: 'over',
                connectedAreas: ['downtown-hotel', 'airport-restaurant'],
                areaFlows: { 'downtown-hotel': { volume: 200, consumption: 'over' }, 'airport-restaurant': { volume: 150, consumption: 'normal' } },
                brands: [
                  {
                    id: 'fresh-squeeze',
                    name: 'Fresh Squeeze',
                    movement: 'fast',
                    parentId: 'juices',
                    totalVolume: 350,
                    consumption: 'over',
                    connectedAreas: ['downtown-hotel', 'airport-restaurant'],
                    areaFlows: { 'downtown-hotel': { volume: 200, consumption: 'over' }, 'airport-restaurant': { volume: 150, consumption: 'normal' } },
                    products: [
                      { id: 'orange-juice', name: 'Orange Juice', movement: 'fast', totalVolume: 220, consumption: 'over', connectedAreas: ['downtown-hotel', 'airport-restaurant'], areaFlows: { 'downtown-hotel': { volume: 130, consumption: 'over' }, 'airport-restaurant': { volume: 90, consumption: 'normal' } } },
                      { id: 'apple-juice', name: 'Apple Juice', movement: 'fast', totalVolume: 130, consumption: 'normal', connectedAreas: ['downtown-hotel', 'airport-restaurant'], areaFlows: { 'downtown-hotel': { volume: 70, consumption: 'normal' }, 'airport-restaurant': { volume: 60, consumption: 'normal' } } }
                    ]
                  }
                ]
              },
              {
                id: 'soft-drinks',
                name: 'Soft Drinks',
                movement: 'fast',
                parentId: 'non-alcoholic',
                totalVolume: 300,
                consumption: 'over',
                connectedAreas: ['city-cafe', 'conference-center'],
                areaFlows: { 'city-cafe': { volume: 180, consumption: 'over' }, 'conference-center': { volume: 120, consumption: 'normal' } },
                brands: [
                  {
                    id: 'cola-brand',
                    name: 'Cola Brand',
                    movement: 'fast',
                    parentId: 'soft-drinks',
                    totalVolume: 300,
                    consumption: 'over',
                    connectedAreas: ['city-cafe', 'conference-center'],
                    areaFlows: { 'city-cafe': { volume: 180, consumption: 'over' }, 'conference-center': { volume: 120, consumption: 'normal' } },
                    products: [
                      { id: 'cola', name: 'Cola', movement: 'fast', totalVolume: 200, consumption: 'over', connectedAreas: ['city-cafe', 'conference-center'], areaFlows: { 'city-cafe': { volume: 120, consumption: 'over' }, 'conference-center': { volume: 80, consumption: 'normal' } } },
                      { id: 'lemon-soda', name: 'Lemon Soda', movement: 'medium', totalVolume: 100, consumption: 'normal', connectedAreas: ['city-cafe', 'conference-center'], areaFlows: { 'city-cafe': { volume: 60, consumption: 'normal' }, 'conference-center': { volume: 40, consumption: 'normal' } } }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'seafood',
        name: 'Seafood',
        movement: 'medium',
        totalVolume: 360,
        consumption: 'normal',
        connectedAreas: ['beach-resort', 'fine-dining', 'rooftop-bar'],
        areaFlows: {
          'beach-resort': { volume: 180, consumption: 'over' },
          'fine-dining': { volume: 120, consumption: 'normal' },
          'rooftop-bar': { volume: 60, consumption: 'under' }
        },
        subcategories: [
          {
            id: 'fish',
            name: 'Fish',
            movement: 'medium',
            parentId: 'seafood',
            totalVolume: 280,
            consumption: 'normal',
            connectedAreas: ['beach-resort', 'fine-dining', 'downtown-hotel'],
            areaFlows: { 'beach-resort': { volume: 140, consumption: 'over' }, 'fine-dining': { volume: 80, consumption: 'normal' }, 'downtown-hotel': { volume: 60, consumption: 'normal' } },
            types: [
              {
                id: 'fresh-fish',
                name: 'Fresh Fish',
                movement: 'fast',
                parentId: 'fish',
                totalVolume: 280,
                consumption: 'normal',
                connectedAreas: ['beach-resort', 'fine-dining', 'downtown-hotel'],
                areaFlows: { 'beach-resort': { volume: 140, consumption: 'over' }, 'fine-dining': { volume: 80, consumption: 'normal' }, 'downtown-hotel': { volume: 60, consumption: 'normal' } },
                brands: [
                  {
                    id: 'ocean-catch',
                    name: 'Ocean Catch',
                    movement: 'fast',
                    parentId: 'fresh-fish',
                    totalVolume: 280,
                    consumption: 'normal',
                    connectedAreas: ['beach-resort', 'fine-dining', 'downtown-hotel'],
                    areaFlows: { 'beach-resort': { volume: 140, consumption: 'over' }, 'fine-dining': { volume: 80, consumption: 'normal' }, 'downtown-hotel': { volume: 60, consumption: 'normal' } },
                    products: [
                      { id: 'salmon', name: 'Salmon', movement: 'fast', totalVolume: 180, consumption: 'over', connectedAreas: ['beach-resort', 'fine-dining'], areaFlows: { 'beach-resort': { volume: 100, consumption: 'over' }, 'fine-dining': { volume: 80, consumption: 'normal' } } },
                      { id: 'tuna', name: 'Tuna', movement: 'medium', totalVolume: 100, consumption: 'normal', connectedAreas: ['beach-resort', 'downtown-hotel'], areaFlows: { 'beach-resort': { volume: 40, consumption: 'normal' }, 'downtown-hotel': { volume: 60, consumption: 'normal' } } }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'shellfish',
            name: 'Shellfish',
            movement: 'occasional',
            parentId: 'seafood',
            totalVolume: 80,
            consumption: 'under',
            connectedAreas: ['fine-dining', 'beach-resort'],
            areaFlows: { 'fine-dining': { volume: 50, consumption: 'under' }, 'beach-resort': { volume: 30, consumption: 'under' } },
            types: [
              {
                id: 'crustaceans',
                name: 'Crustaceans',
                movement: 'occasional',
                parentId: 'shellfish',
                totalVolume: 80,
                consumption: 'under',
                connectedAreas: ['fine-dining', 'beach-resort'],
                areaFlows: { 'fine-dining': { volume: 50, consumption: 'under' }, 'beach-resort': { volume: 30, consumption: 'under' } },
                brands: [
                  {
                    id: 'premium-seafood',
                    name: 'Premium Seafood',
                    movement: 'occasional',
                    parentId: 'crustaceans',
                    totalVolume: 80,
                    consumption: 'under',
                    connectedAreas: ['fine-dining', 'beach-resort'],
                    areaFlows: { 'fine-dining': { volume: 50, consumption: 'under' }, 'beach-resort': { volume: 30, consumption: 'under' } },
                    products: [
                      { id: 'lobster', name: 'Lobster', movement: 'occasional', totalVolume: 30, consumption: 'under', connectedAreas: ['fine-dining'], areaFlows: { 'fine-dining': { volume: 30, consumption: 'under' } } },
                      { id: 'shrimp', name: 'Shrimp', movement: 'medium', totalVolume: 50, consumption: 'normal', connectedAreas: ['fine-dining', 'beach-resort'], areaFlows: { 'fine-dining': { volume: 20, consumption: 'normal' }, 'beach-resort': { volume: 30, consumption: 'normal' } } }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'bakery',
        name: 'Bakery',
        movement: 'fast',
        totalVolume: 500,
        consumption: 'normal',
        connectedAreas: ['downtown-hotel', 'airport-restaurant', 'city-cafe', 'suburban-hotel'],
        areaFlows: {
          'downtown-hotel': { volume: 140, consumption: 'normal' },
          'airport-restaurant': { volume: 100, consumption: 'normal' },
          'city-cafe': { volume: 180, consumption: 'over' },
          'suburban-hotel': { volume: 80, consumption: 'under' }
        },
        subcategories: [
          {
            id: 'breads',
            name: 'Breads',
            movement: 'fast',
            parentId: 'bakery',
            totalVolume: 300,
            consumption: 'normal',
            connectedAreas: ['downtown-hotel', 'airport-restaurant', 'city-cafe'],
            areaFlows: { 'downtown-hotel': { volume: 100, consumption: 'normal' }, 'airport-restaurant': { volume: 80, consumption: 'normal' }, 'city-cafe': { volume: 120, consumption: 'over' } },
            types: [
              {
                id: 'artisan-bread',
                name: 'Artisan Bread',
                movement: 'fast',
                parentId: 'breads',
                totalVolume: 300,
                consumption: 'normal',
                connectedAreas: ['downtown-hotel', 'airport-restaurant', 'city-cafe'],
                areaFlows: { 'downtown-hotel': { volume: 100, consumption: 'normal' }, 'airport-restaurant': { volume: 80, consumption: 'normal' }, 'city-cafe': { volume: 120, consumption: 'over' } },
                brands: [
                  {
                    id: 'local-bakery',
                    name: 'Local Bakery',
                    movement: 'fast',
                    parentId: 'artisan-bread',
                    totalVolume: 300,
                    consumption: 'normal',
                    connectedAreas: ['downtown-hotel', 'airport-restaurant', 'city-cafe'],
                    areaFlows: { 'downtown-hotel': { volume: 100, consumption: 'normal' }, 'airport-restaurant': { volume: 80, consumption: 'normal' }, 'city-cafe': { volume: 120, consumption: 'over' } },
                    products: [
                      { id: 'sourdough', name: 'Sourdough', movement: 'fast', totalVolume: 150, consumption: 'normal', connectedAreas: ['downtown-hotel', 'city-cafe'], areaFlows: { 'downtown-hotel': { volume: 70, consumption: 'normal' }, 'city-cafe': { volume: 80, consumption: 'normal' } } },
                      { id: 'baguette', name: 'Baguette', movement: 'fast', totalVolume: 150, consumption: 'over', connectedAreas: ['airport-restaurant', 'city-cafe'], areaFlows: { 'airport-restaurant': { volume: 80, consumption: 'normal' }, 'city-cafe': { volume: 70, consumption: 'over' } } }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'pastries',
            name: 'Pastries',
            movement: 'medium',
            parentId: 'bakery',
            totalVolume: 200,
            consumption: 'over',
            connectedAreas: ['downtown-hotel', 'city-cafe', 'conference-center'],
            areaFlows: { 'downtown-hotel': { volume: 60, consumption: 'normal' }, 'city-cafe': { volume: 80, consumption: 'over' }, 'conference-center': { volume: 60, consumption: 'normal' } },
            types: [
              {
                id: 'breakfast-pastries',
                name: 'Breakfast Pastries',
                movement: 'medium',
                parentId: 'pastries',
                totalVolume: 200,
                consumption: 'over',
                connectedAreas: ['downtown-hotel', 'city-cafe', 'conference-center'],
                areaFlows: { 'downtown-hotel': { volume: 60, consumption: 'normal' }, 'city-cafe': { volume: 80, consumption: 'over' }, 'conference-center': { volume: 60, consumption: 'normal' } },
                brands: [
                  {
                    id: 'french-patisserie',
                    name: 'French Patisserie',
                    movement: 'medium',
                    parentId: 'breakfast-pastries',
                    totalVolume: 200,
                    consumption: 'over',
                    connectedAreas: ['downtown-hotel', 'city-cafe', 'conference-center'],
                    areaFlows: { 'downtown-hotel': { volume: 60, consumption: 'normal' }, 'city-cafe': { volume: 80, consumption: 'over' }, 'conference-center': { volume: 60, consumption: 'normal' } },
                    products: [
                      { id: 'croissants', name: 'Croissants', movement: 'fast', totalVolume: 120, consumption: 'over', connectedAreas: ['downtown-hotel', 'city-cafe'], areaFlows: { 'downtown-hotel': { volume: 40, consumption: 'normal' }, 'city-cafe': { volume: 80, consumption: 'over' } } },
                      { id: 'danish', name: 'Danish', movement: 'medium', totalVolume: 80, consumption: 'normal', connectedAreas: ['downtown-hotel', 'conference-center'], areaFlows: { 'downtown-hotel': { volume: 40, consumption: 'normal' }, 'conference-center': { volume: 40, consumption: 'normal' } } }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    areas: [
      { id: 'downtown-hotel', name: 'Downtown Hotel', type: 'hotel' },
      { id: 'beach-resort', name: 'Beach Resort', type: 'resort' },
      { id: 'airport-restaurant', name: 'Airport Restaurant', type: 'restaurant' },
      { id: 'rooftop-bar', name: 'Rooftop Bar', type: 'bar' },
      { id: 'conference-center', name: 'Conference Center', type: 'venue' },
      { id: 'fine-dining', name: 'Fine Dining', type: 'restaurant' },
      { id: 'suburban-hotel', name: 'Suburban Hotel', type: 'hotel' },
      { id: 'city-cafe', name: 'City Cafe', type: 'cafe' }
    ]
  },
  supermarket: {
    categories: [
      {
        id: 'fresh-produce',
        name: 'Fresh Produce',
        movement: 'fast',
        totalVolume: 1530,
        consumption: 'over',
        connectedAreas: ['main-store', 'mall-branch', 'suburban-store', 'city-center'],
        areaFlows: {
          'main-store': { volume: 500, consumption: 'over' },
          'mall-branch': { volume: 350, consumption: 'normal' },
          'suburban-store': { volume: 280, consumption: 'under' },
          'city-center': { volume: 400, consumption: 'normal' }
        },
        subcategories: []
      },
      {
        id: 'dairy-frozen',
        name: 'Dairy & Frozen',
        movement: 'fast',
        totalVolume: 1350,
        consumption: 'normal',
        connectedAreas: ['main-store', 'express-outlet', 'mall-branch', 'suburban-store'],
        areaFlows: {
          'main-store': { volume: 450, consumption: 'normal' },
          'express-outlet': { volume: 200, consumption: 'under' },
          'mall-branch': { volume: 380, consumption: 'over' },
          'suburban-store': { volume: 320, consumption: 'normal' }
        },
        subcategories: []
      }
    ],
    areas: [
      { id: 'main-store', name: 'Main Store', type: 'store' },
      { id: 'express-outlet', name: 'Express Outlet', type: 'outlet' },
      { id: 'mall-branch', name: 'Mall Branch', type: 'branch' },
      { id: 'suburban-store', name: 'Suburban Store', type: 'store' },
      { id: 'city-center', name: 'City Center', type: 'store' },
      { id: 'airport-branch', name: 'Airport Branch', type: 'branch' }
    ]
  },
  pharma: {
    categories: [
      {
        id: 'emergency-meds',
        name: 'Emergency Meds',
        movement: 'fast',
        totalVolume: 830,
        consumption: 'over',
        connectedAreas: ['general-hospital', 'emergency-center', 'icu-department'],
        areaFlows: {
          'general-hospital': { volume: 200, consumption: 'normal' },
          'emergency-center': { volume: 350, consumption: 'over' },
          'icu-department': { volume: 280, consumption: 'over' }
        },
        subcategories: []
      },
      {
        id: 'surgery-supplies',
        name: 'Surgery Supplies',
        movement: 'medium',
        totalVolume: 700,
        consumption: 'normal',
        connectedAreas: ['general-hospital', 'surgical-wing', 'specialty-clinic'],
        areaFlows: {
          'general-hospital': { volume: 180, consumption: 'normal' },
          'surgical-wing': { volume: 400, consumption: 'over' },
          'specialty-clinic': { volume: 120, consumption: 'under' }
        },
        subcategories: []
      }
    ],
    areas: [
      { id: 'general-hospital', name: 'General Hospital', type: 'hospital' },
      { id: 'specialty-clinic', name: 'Specialty Clinic', type: 'clinic' },
      { id: 'emergency-center', name: 'Emergency Center', type: 'emergency' },
      { id: 'surgical-wing', name: 'Surgical Wing', type: 'surgery' },
      { id: 'icu-department', name: 'ICU Department', type: 'icu' },
      { id: 'outpatient-pharmacy', name: 'Outpatient Pharmacy', type: 'pharmacy' }
    ]
  }
};

export const movementColors = {
  fast: '#22c55e',
  medium: '#eab308',
  slow: '#f97316',
  occasional: '#ef4444'
};

export const consumptionWidths = {
  over: { base: 12, multiplier: 1.5 },
  normal: { base: 6, multiplier: 1.0 },
  under: { base: 3, multiplier: 0.5 }
};

export const getMovementLabel = (movement) => {
  const labels = {
    fast: 'Fast Moving',
    medium: 'Medium',
    slow: 'Slow Moving',
    occasional: 'Occasional'
  };
  return labels[movement] || movement;
};

export const getConsumptionLabel = (consumption) => {
  const labels = {
    over: 'Over Consumption',
    normal: 'Normal',
    under: 'Under Consumption'
  };
  return labels[consumption] || consumption;
};
