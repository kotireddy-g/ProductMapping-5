import React, { useState, useMemo } from 'react';
import { sankeyData } from '../../data/secondScreenData';

const EnhancedSankeyDiagram = ({ selectedType, onNodeClick, onForecastClick, currentDataSet = 1 }) => {
  const [selectedRightNode, setSelectedRightNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Get OTIF-based color
  const getOtifColor = (value, maxValue) => {
    const ratio = value / maxValue;
    if (ratio > 0.8) return '#22c55e'; // Green - Good OTIF
    if (ratio > 0.5) return '#eab308'; // Yellow - Medium OTIF
    return '#ef4444'; // Red - Poor OTIF
  };

  // Generate connections between left and right nodes
  const connections = useMemo(() => {
    const conns = [];
    sankeyData.leftNodes.forEach((leftNode, leftIndex) => {
      sankeyData.rightNodes.forEach((rightNode, rightIndex) => {
        // Create realistic connections with varying strengths
        const strength = Math.random() * 0.8 + 0.2; // 0.2 to 1.0
        const value = Math.floor(leftNode.value * strength * (Math.random() * 0.5 + 0.3));
        
        if (value > 50) { // Only show significant connections
          conns.push({
            source: leftIndex,
            target: rightIndex,
            value: value,
            sourceNode: leftNode,
            targetNode: rightNode,
            // Color based on OTIF status
            color: getOtifColor(value, leftNode.value)
          });
        }
      });
    });
    return conns.sort((a, b) => b.value - a.value);
  }, [getOtifColor]);

  // Handle right node click for drill-down
  const handleRightNodeClick = (node) => {
    if (selectedRightNode?.id === node.id) {
      setSelectedRightNode(null);
    } else {
      setSelectedRightNode(node);
    }
  };

  // Handle left node click for forecast navigation
  const handleLeftNodeClick = (node) => {
    onForecastClick(node);
  };

  const nodeHeight = 40;
  const nodeSpacing = 60;
  const diagramWidth = 800;
  const diagramHeight = Math.max(sankeyData.leftNodes.length, sankeyData.rightNodes.length) * nodeSpacing + 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* Legend */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Supply Chain Flow Analysis</h3>
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="text-slate-600">Bands:</div>
            <div className="text-slate-500">Represent quantity (width) and status (color)</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-green-500 rounded"></div>
              <span className="text-slate-600">Good OTIF (&gt;80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-yellow-500 rounded"></div>
              <span className="text-slate-600">Medium OTIF (50-80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-red-500 rounded"></div>
              <span className="text-slate-600">Poor OTIF (&lt;50%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sankey Diagram */}
      <div className="relative overflow-x-auto">
        <svg width={diagramWidth} height={diagramHeight} className="mx-auto">
          {/* Connections */}
          {connections.map((conn, index) => {
            const sourceY = 100 + conn.source * nodeSpacing + nodeHeight / 2;
            const targetY = 100 + conn.target * nodeSpacing + nodeHeight / 2;
            const sourceX = 200;
            const targetX = 600;
            
            // Calculate ribbon width based on value
            const maxValue = Math.max(...connections.map(c => c.value));
            const ribbonWidth = Math.max(2, (conn.value / maxValue) * 20);
            
            const path = `M ${sourceX} ${sourceY - ribbonWidth/2} 
                         C ${sourceX + 150} ${sourceY - ribbonWidth/2} ${targetX - 150} ${targetY - ribbonWidth/2} ${targetX} ${targetY - ribbonWidth/2}
                         L ${targetX} ${targetY + ribbonWidth/2}
                         C ${targetX - 150} ${targetY + ribbonWidth/2} ${sourceX + 150} ${sourceY + ribbonWidth/2} ${sourceX} ${sourceY + ribbonWidth/2}
                         Z`;

            return (
              <path
                key={index}
                d={path}
                fill={conn.color}
                fillOpacity={hoveredNode === conn.sourceNode.id || hoveredNode === conn.targetNode.id ? 0.8 : 0.6}
                stroke="none"
                className="transition-all duration-200"
              />
            );
          })}

          {/* Left Nodes */}
          {sankeyData.leftNodes.map((node, index) => {
            const y = 100 + index * nodeSpacing;
            const isHovered = hoveredNode === node.id;
            
            return (
              <g key={node.id}>
                <rect
                  x={50}
                  y={y}
                  width={150}
                  height={nodeHeight}
                  fill={node.color}
                  rx={8}
                  className="cursor-pointer transition-all duration-200"
                  opacity={isHovered ? 0.9 : 0.8}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleLeftNodeClick(node)}
                />
                <text
                  x={125}
                  y={y + nodeHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-sm font-medium pointer-events-none"
                >
                  {node.name}
                </text>
                <text
                  x={125}
                  y={y + nodeHeight + 15}
                  textAnchor="middle"
                  className="fill-slate-600 text-xs pointer-events-none"
                >
                  {node.value.toLocaleString()} units
                </text>
              </g>
            );
          })}

          {/* Right Nodes */}
          {sankeyData.rightNodes.map((node, index) => {
            const y = 100 + index * nodeSpacing;
            const isHovered = hoveredNode === node.id;
            const isSelected = selectedRightNode?.id === node.id;
            
            return (
              <g key={node.id}>
                <rect
                  x={600}
                  y={y}
                  width={150}
                  height={nodeHeight}
                  fill={node.color}
                  rx={8}
                  className="cursor-pointer transition-all duration-200"
                  opacity={isHovered || isSelected ? 0.9 : 0.8}
                  stroke={isSelected ? '#1f2937' : 'none'}
                  strokeWidth={isSelected ? 2 : 0}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleRightNodeClick(node)}
                />
                <text
                  x={675}
                  y={y + nodeHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-sm font-medium pointer-events-none"
                >
                  {node.name}
                </text>
                <text
                  x={675}
                  y={y + nodeHeight + 15}
                  textAnchor="middle"
                  className="fill-slate-600 text-xs pointer-events-none"
                >
                  {node.value.toLocaleString()} units
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Drill-down Panel */}
      {selectedRightNode && (
        <div className="mt-6 bg-slate-50 rounded-lg p-4">
          <h4 className="font-semibold text-slate-900 mb-3">
            {selectedRightNode.name} - Detailed Breakdown
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedRightNode.drillDown.map((category) => (
              <div key={category.id} className="bg-white rounded-lg p-3 border border-slate-200">
                <h5 className="font-medium text-slate-800 mb-2">{category.name}</h5>
                <div className="space-y-1">
                  {category.subItems.map((item, index) => (
                    <div key={index} className="text-sm text-slate-600 flex items-center justify-between">
                      <span>{item}</span>
                      <span className="text-xs text-slate-500">
                        {Math.floor(Math.random() * 500 + 100)} units
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-sm text-slate-500 text-center">
        Click on left nodes to view Forecast Review & Actions • Click on right nodes for detailed breakdown
      </div>
    </div>
  );
};

export default EnhancedSankeyDiagram;
