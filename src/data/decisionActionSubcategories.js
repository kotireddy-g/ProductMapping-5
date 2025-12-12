// Decision Action Subcategories Data
// This file contains the detailed subcategories for each main decision action category

export const decisionActionSubcategories = {
    'usage-velocity': [
        { id: 'fast_moving', name: 'FAST_MOVING', count: 12, description: 'High velocity items requiring frequent replenishment' },
        { id: 'medium_moving', name: 'MEDIUM_MOVING', count: 8, description: 'Moderate velocity items' },
        { id: 'slow_moving', name: 'SLOW_MOVING', count: 7, description: 'Low velocity items' },
        { id: 'very_slow_moving', name: 'VERY_SLOW_MOVING / NON_MOVING', count: 6, description: 'Very low or no movement' },
        { id: 'new_item', name: 'NEW_ITEM', count: 9, description: 'Recently added items' },
        { id: 'obsolete', name: 'OBSOLETE / TO_BE_DISCONTINUED', count: 3, description: 'Items to be phased out' }
    ],

    'stock-position': [
        { id: 'stockout', name: 'STOCKOUT / NO_STOCK', count: 8, description: 'Items completely out of stock' },
        { id: 'critical_low', name: 'CRITICAL_LOW_STOCK', count: 6, description: 'Critically low stock levels' },
        { id: 'low_stock', name: 'LOW_STOCK', count: 5, description: 'Below minimum stock levels' },
        { id: 'healthy_stock', name: 'HEALTHY_STOCK', count: 4, description: 'Optimal stock levels' },
        { id: 'overstock', name: 'OVERSTOCK', count: 7, description: 'Above maximum stock levels' },
        { id: 'excess_stock', name: 'EXCESS_STOCK / SURPLUS', count: 5, description: 'Significantly overstocked' },
        { id: 'blocked_stock', name: 'BLOCKED_STOCK', count: 2, description: 'Stock blocked for various reasons' },
        { id: 'quarantined', name: 'QUARANTINED_STOCK', count: 1, description: 'Stock under quarantine' }
    ],

    'expiry-shelf-life': [
        { id: 'expiring_imminent', name: 'EXPIRING_IMMINENT (<30 days)', count: 15, description: 'Items expiring within 30 days' },
        { id: 'near_expiry', name: 'NEAR_EXPIRY (1–3 months)', count: 12, description: 'Items expiring in 1-3 months' },
        { id: 'medium_shelf', name: 'MEDIUM_SHELF_LIFE', count: 8, description: 'Items with medium shelf life' },
        { id: 'long_shelf', name: 'LONG_SHELF_LIFE', count: 5, description: 'Items with long shelf life' },
        { id: 'expired', name: 'EXPIRED', count: 6, description: 'Already expired items' },
        { id: 'high_expiry_risk', name: 'HIGH_EXPIRY_RISK', count: 4, description: 'High risk of expiry' },
        { id: 'low_expiry_risk', name: 'LOW_EXPIRY_RISK', count: 2, description: 'Low risk of expiry' }
    ],

    'demand-pattern': [
        { id: 'stable_demand', name: 'STABLE_DEMAND', count: 6, description: 'Consistent demand pattern' },
        { id: 'volatile_demand', name: 'VOLATILE_DEMAND', count: 5, description: 'Highly variable demand' },
        { id: 'seasonal_demand', name: 'SEASONAL_DEMAND', count: 4, description: 'Seasonal demand patterns' },
        { id: 'programmatic_demand', name: 'PROGRAMMATIC_DEMAND', count: 3, description: 'Program-driven demand' },
        { id: 'event_driven', name: 'EVENT_DRIVEN_DEMAND', count: 4, description: 'Event-based demand spikes' },
        { id: 'one_off', name: 'ONE_OFF / EXCEPTIONAL_DEMAND', count: 3, description: 'One-time demand' },
        { id: 'unpredictable', name: 'UNPREDICTABLE_DEMAND', count: 3, description: 'Unpredictable demand pattern' }
    ],

    'criticality-service': [
        { id: 'life_saving', name: 'LIFE_SAVING / CRITICAL_CARE_ITEM', count: 8, description: 'Life-saving medications' },
        { id: 'high_criticality', name: 'HIGH_CRITICALITY', count: 6, description: 'Highly critical items' },
        { id: 'medium_criticality', name: 'MEDIUM_CRITICALITY', count: 5, description: 'Moderately critical items' },
        { id: 'low_criticality', name: 'LOW_CRITICALITY', count: 3, description: 'Low criticality items' },
        { id: 'high_service_level', name: 'HIGH_SERVICE_LEVEL_TARGET', count: 4, description: 'High service level required' },
        { id: 'normal_service_level', name: 'NORMAL_SERVICE_LEVEL_TARGET', count: 3, description: 'Normal service level' },
        { id: 'low_service_level', name: 'LOW_SERVICE_LEVEL_TARGET', count: 2, description: 'Low service level acceptable' }
    ],

    'value-cost': [
        { id: 'high_value', name: 'HIGH_VALUE_ITEM', count: 6, description: 'High-value items' },
        { id: 'medium_value', name: 'MEDIUM_VALUE_ITEM', count: 5, description: 'Medium-value items' },
        { id: 'low_value', name: 'LOW_VALUE_ITEM', count: 3, description: 'Low-value items' },
        { id: 'high_margin', name: 'HIGH_MARGIN_ITEM', count: 3, description: 'High profit margin' },
        { id: 'low_margin', name: 'LOW_MARGIN_ITEM', count: 2, description: 'Low profit margin' },
        { id: 'high_stock_value', name: 'HIGH_STOCK_VALUE', count: 2, description: 'High stock value' },
        { id: 'low_stock_value', name: 'LOW_STOCK_VALUE', count: 1, description: 'Low stock value' }
    ],

    'policy-handling': [
        { id: 'restricted_use', name: 'RESTRICTED_USE', count: 3, description: 'Restricted usage items' },
        { id: 'formulary', name: 'FORMULARY_ITEM', count: 2, description: 'Formulary items' },
        { id: 'non_formulary', name: 'NON_FORMULARY_ITEM', count: 2, description: 'Non-formulary items' },
        { id: 'substitution_allowed', name: 'SUBSTITUTION_ALLOWED', count: 2, description: 'Substitution permitted' },
        { id: 'substitution_not_allowed', name: 'SUBSTITUTION_NOT_ALLOWED', count: 1, description: 'No substitution allowed' },
        { id: 'cold_chain', name: 'COLD_CHAIN_ITEM', count: 2, description: 'Requires cold chain' },
        { id: 'controlled_substance', name: 'CONTROLLED_SUBSTANCE', count: 1, description: 'Controlled substances' },
        { id: 'kit_component', name: 'KIT_COMPONENT', count: 1, description: 'Part of a kit' }
    ]
};
