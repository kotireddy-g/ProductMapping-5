import React, { useState, useMemo } from 'react';
import { medicineCategories, hospitalAreas, flowConnections } from '../../data/consistentSyntheticData';

const ChordDiagram = ({ 
  onLeftNodeClick, 
  onRightNodeClick, 
  currentDataSet = 1,
  selectedPeriod = 'weekly',
  selectedFilters = [],
  selectionType = 'kpi',
  selectedItem = null
}) => {
  const [selectedRightNode, setSelectedRightNode] = useState(null);
  const [drillLevel, setDrillLevel] = useState(1); // 1, 2, or 3
  const [hoveredConnection, setHoveredConnection] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);

  // Get OTIF-based color for ribbons
  const getOtifColor = (otif) => {
    if (otif >= 90) return '#22c55e'; // Green - Good OTIF (>90%)
    if (otif >= 80) return '#eab308'; // Yellow - Medium OTIF (80-90%)
    if (otif >= 70) return '#f97316'; // Orange - Low OTIF (70-80%)
    return '#ef4444'; // Red - Poor OTIF (<70%)
  };

  // Get ribbon thickness based on quantity
  const getRibbonThickness = (quantity, maxQuantity) => {
    const minThickness = 2;
    const maxThickness = 20;
    const ratio = quantity / maxQuantity;
    return minThickness + (ratio * (maxThickness - minThickness));
  };

  // Get filtered data based on period and filters
  const getFilteredData = useMemo(() => {
    let filteredConnections = [...flowConnections];
    
    // Apply period-based multipliers
    const periodMultipliers = {
      'daily': 0.3,
      'weekly': 1.0,
      'monthly': 4.2,
      'quarterly': 12.6,
      'yearly': 52.0
    };
    
    const multiplier = periodMultipliers[selectedPeriod] || 1.0;
    
    // Apply filter-based modifications
    if (selectedFilters.length > 0) {
      // Simulate filter effects on OTIF and quantities
      filteredConnections = filteredConnections.map(conn => ({
        ...conn,
        quantity: Math.round(conn.quantity * multiplier * (0.8 + Math.random() * 0.4)),
        otif: Math.max(60, Math.min(100, conn.otif + (Math.random() - 0.5) * 20))
      }));
    } else {
      filteredConnections = filteredConnections.map(conn => ({
        ...conn,
        quantity: Math.round(conn.quantity * multiplier),
        otif: conn.otif
      }));
    }
    
    return filteredConnections;
  }, [selectedPeriod, selectedFilters]);

  // Calculate positions and dimensions
  const leftNodes = Object.values(medicineCategories);
  const rightNodes = Object.values(hospitalAreas);
  
  const diagramWidth = 1000; // Increased width for external labels
  const diagramHeight = 600;
  const nodeWidth = 120;
  const nodeHeight = 35;
  const leftX = 200; // More space for left labels
  const rightX = diagramWidth - nodeWidth - 200; // More space for right labels
  const nodeSpacing = 70;

  // Calculate maximum quantity for ribbon scaling using filtered data
  const maxQuantity = Math.max(...getFilteredData.map(conn => conn.quantity));

  // Handle right node click for 3-level drill-down
  const handleRightNodeClick = (node) => {
    if (drillLevel === 1) {
      // First click: go to level 2
      setSelectedRightNode(node);
      setDrillLevel(2);
      setBreadcrumb([node.name]);
      if (onRightNodeClick) onRightNodeClick(node);
    } else if (drillLevel === 2) {
      // Second click: go to level 3
      setDrillLevel(3);
      setBreadcrumb(prev => [...prev, node.name]);
    } else {
      // Third click: reset to level 1
      resetToLevel1();
    }
  };

  const resetToLevel1 = () => {
    setSelectedRightNode(null);
    setDrillLevel(1);
    setBreadcrumb([]);
  };

  // Get current nodes to display based on drill level
  const getCurrentRightNodes = () => {
    if (drillLevel === 1) {
      return Object.values(hospitalAreas);
    } else if (drillLevel === 2 && selectedRightNode?.level2) {
      // Show level 2 breakdown
      return Object.entries(selectedRightNode.level2).map(([key, category]) => ({
        id: `${selectedRightNode.id}-${key}`,
        name: category.name,
        totalUnits: category.units,
        isLevel2: true,
        parentId: selectedRightNode.id,
        level3: category.level3
      }));
    } else if (drillLevel === 3 && selectedRightNode?.level2) {
      // Show level 3 breakdown - find the selected level 2 node
      const level2Nodes = Object.entries(selectedRightNode.level2);
      const selectedLevel2 = level2Nodes.find(([key, category]) => 
        breadcrumb[1] === category.name
      );
      
      if (selectedLevel2) {
        return selectedLevel2[1].level3.map((item, index) => ({
          id: `${selectedRightNode.id}-${selectedLevel2[0]}-${index}`,
          name: item,
          totalUnits: Math.floor(selectedLevel2[1].units / selectedLevel2[1].level3.length),
          isLevel3: true,
          parentId: selectedLevel2[1].name
        }));
      }
    }
    return Object.values(hospitalAreas);
  };

  const currentRightNodes = getCurrentRightNodes();

  // Handle left node click for forecast navigation
  const handleLeftNodeClick = (node) => {
    if (onLeftNodeClick) onLeftNodeClick(node);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* Header with Movement Speed Legend */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Supply Chain Flow Analysis</h3>
          </div>
        </div>

        {/* Movement Speed Legend */}
        <div className="flex items-center gap-6 text-sm mb-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Movement Speed:</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-slate-600">Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span className="text-slate-600">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500"></div>
              <span className="text-slate-600">Slow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className="text-slate-600">Occasional</span>
            </div>
          </div>
        </div>

        {/* Thickness Legend */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Thickness = Consumption:</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-2 rounded bg-slate-500"></div>
              <span className="text-slate-600">Over</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 rounded bg-slate-500"></div>
              <span className="text-slate-600">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded bg-slate-500"></div>
              <span className="text-slate-600">Under</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chord Diagram */}
      <div className="relative">
        <svg width={diagramWidth} height={diagramHeight} className="mx-auto">
          {/* Ribbons/Connections */}
          {getFilteredData.map((connection, index) => {
            const sourceIndex = leftNodes.findIndex(node => node.name === connection.source);
            let targetIndex = -1;
            
            // Find target index based on drill level
            if (drillLevel === 1) {
              targetIndex = currentRightNodes.findIndex(node => node.name === connection.target);
            } else if (drillLevel === 2) {
              // For level 2, show connections to level 2 nodes
              targetIndex = currentRightNodes.findIndex(node => 
                connection.target === selectedRightNode?.name
              );
            } else if (drillLevel === 3) {
              // For level 3, distribute connections among level 3 nodes
              targetIndex = index % currentRightNodes.length;
            }
            
            if (sourceIndex === -1 || targetIndex === -1) return null;

            const sourceY = 50 + sourceIndex * nodeSpacing + nodeHeight / 2;
            const targetY = 50 + targetIndex * nodeSpacing + nodeHeight / 2;
            const thickness = getRibbonThickness(connection.quantity, maxQuantity);
            const color = getOtifColor(connection.otif);
            
            const isHovered = hoveredConnection === index;
            
            // Create curved path for ribbon
            const path = `M ${leftX + nodeWidth} ${sourceY - thickness/2} 
                         C ${leftX + nodeWidth + 150} ${sourceY - thickness/2} ${rightX - 150} ${targetY - thickness/2} ${rightX} ${targetY - thickness/2}
                         L ${rightX} ${targetY + thickness/2}
                         C ${rightX - 150} ${targetY + thickness/2} ${leftX + nodeWidth + 150} ${sourceY + thickness/2} ${leftX + nodeWidth} ${sourceY + thickness/2}
                         Z`;

            return (
              <path
                key={index}
                d={path}
                fill={color}
                fillOpacity={isHovered ? 0.8 : 0.6}
                stroke={isHovered ? '#1f2937' : 'none'}
                strokeWidth={isHovered ? 1 : 0}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={(e) => {
                  console.log('Ribbon hovered:', index, connection);
                  setHoveredConnection(index);
                }}
                onMouseLeave={() => {
                  console.log('Ribbon unhovered');
                  setHoveredConnection(null);
                }}
                onClick={() => {
                  // Navigate to RCA & Recommendations
                  console.log('Navigate to RCA for:', connection);
                }}
              />
            );
          })}

          {/* Left Nodes (Medicine Categories) */}
          {leftNodes.map((node, index) => {
            const y = 50 + index * nodeSpacing;
            
            return (
              <g key={node.id}>
                {/* Clean blue rectangle node */}
                <rect
                  x={leftX}
                  y={y}
                  width={nodeWidth}
                  height={nodeHeight}
                  fill="#3b82f6"
                  rx={6}
                  className="cursor-pointer transition-all duration-200 hover:fill-blue-600"
                  onClick={() => handleLeftNodeClick(node)}
                />
                {/* Node name outside to the left */}
                <text
                  x={leftX - 15}
                  y={y + nodeHeight / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-slate-800 text-sm font-medium pointer-events-none"
                >
                  {node.name}
                </text>
              </g>
            );
          })}

          {/* Right Nodes (Hospital Areas) */}
          {currentRightNodes.map((node, index) => {
            const y = 50 + index * nodeSpacing;
            const isSelected = selectedRightNode?.id === node.id || selectedRightNode?.id === node.parentId;
            
            return (
              <g key={node.id}>
                {/* Clean blue rectangle node */}
                <rect
                  x={rightX}
                  y={y}
                  width={nodeWidth}
                  height={nodeHeight}
                  fill="#3b82f6"
                  rx={6}
                  className="cursor-pointer transition-all duration-200 hover:fill-blue-600"
                  stroke={isSelected ? '#1f2937' : 'none'}
                  strokeWidth={isSelected ? 2 : 0}
                  onClick={() => handleRightNodeClick(node)}
                />
                {/* Node name outside to the right */}
                <text
                  x={rightX + nodeWidth + 15}
                  y={y + nodeHeight / 2}
                  textAnchor="start"
                  dominantBaseline="middle"
                  className="fill-slate-800 text-sm font-medium pointer-events-none"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Breadcrumb navigation */}
      {drillLevel > 1 && (
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={resetToLevel1}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            ← Back to Overview
          </button>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Level {drillLevel}:</span>
            {breadcrumb.map((item, index) => (
              <span key={index}>
                {index > 0 && ' → '}
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Flow Details Tooltip */}
      {hoveredConnection !== null && hoveredConnection < getFilteredData.length && (
        <div className="absolute top-4 right-4 bg-slate-800 text-white p-4 rounded-xl shadow-xl text-sm min-w-64 z-50 border border-slate-600">
          <div className="text-blue-300 font-semibold mb-3 text-base">Flow Details</div>
          
          <div className="space-y-2">
            <div>
              <span className="text-slate-400">From: </span>
              <span className="text-white font-medium">{getFilteredData[hoveredConnection].source}</span>
            </div>
            
            <div>
              <span className="text-slate-400">To: </span>
              <span className="text-white font-medium">{getFilteredData[hoveredConnection].target}</span>
            </div>
            
            <div>
              <span className="text-slate-400">Volume: </span>
              <span className="text-white font-medium">{getFilteredData[hoveredConnection].quantity} units</span>
            </div>
            
            <div>
              <span className="text-slate-400">Movement: </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                getFilteredData[hoveredConnection].otif >= 90 ? 'bg-green-600 text-white' :
                getFilteredData[hoveredConnection].otif >= 80 ? 'bg-yellow-600 text-white' :
                getFilteredData[hoveredConnection].otif >= 70 ? 'bg-orange-600 text-white' :
                'bg-red-600 text-white'
              }`}>
                {getFilteredData[hoveredConnection].otif >= 90 ? 'fast' :
                 getFilteredData[hoveredConnection].otif >= 80 ? 'medium' :
                 getFilteredData[hoveredConnection].otif >= 70 ? 'slow' : 'slow'}
              </span>
            </div>
            
            <div>
              <span className="text-slate-400">Status: </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                getFilteredData[hoveredConnection].otif >= 80 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {getFilteredData[hoveredConnection].otif >= 80 ? 'Normal' : 'Alert'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChordDiagram;
