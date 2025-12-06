import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { medicineCategories, hospitalDepartments, chordConnections } from '../../data/unifiedPharmaData';

const movementColors = {
  'fast-moving': '#059669',
  'medium': '#2563eb',
  'slow': '#d97706',
  'occasional': '#7c3aed'
};

const movementLabels = [
  { type: 'fast-moving', label: 'Fast Moving', color: '#059669' },
  { type: 'medium', label: 'Medium', color: '#2563eb' },
  { type: 'slow', label: 'Slow Moving', color: '#d97706' },
  { type: 'occasional', label: 'Occasional', color: '#7c3aed' }
];

const AnimatedChordDiagram = ({ onCategoryClick, onDepartmentClick }) => {
  const svgRef = useRef(null);
  const [selectedL1, setSelectedL1] = useState(null);
  const [selectedL2, setSelectedL2] = useState(null);
  const [hoveredConnection, setHoveredConnection] = useState(null);
  const [tooltipInfo, setTooltipInfo] = useState(null);

  const getLevel2Items = () => {
    if (!selectedL1) return [];
    return hospitalDepartments.level2[selectedL1] || [];
  };

  const getLevel3Items = () => {
    if (!selectedL2) return [];
    return hospitalDepartments.level3[selectedL2] || [];
  };

  const rightSideItems = selectedL2 
    ? getLevel3Items() 
    : selectedL1 
      ? getLevel2Items() 
      : hospitalDepartments.level1;

  const getMovementType = (value) => {
    if (value > 80) return 'fast-moving';
    if (value > 50) return 'medium';
    if (value > 25) return 'slow';
    return 'occasional';
  };

  const getStockLevel = (value) => {
    if (value > 85) return 'overstocking';
    if (value < 30) return 'understocking';
    return 'normal';
  };

  const getStockThickness = (stockLevel) => {
    switch (stockLevel) {
      case 'overstocking': return 12;
      case 'understocking': return 8;
      case 'normal': return 6;
      default: return 4;
    }
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = 500;
    const padding = 150; // Increased padding for better spacing
    const leftX = 200;
    const rightX = width - 300;

    const leftNodes = medicineCategories.map((cat, i) => ({
      ...cat,
      x: leftX,
      y: 60 + i * 55,
      side: 'left'
    }));

    const rightNodes = rightSideItems.map((dept, i) => {
      // Generate realistic OTIF percentages for each department
      const otifPercentages = [94.2, 87.5, 91.8, 89.3, 85.7, 92.1, 88.9, 90.4];
      return {
        ...dept,
        x: rightX,
        y: 60 + i * (300 / Math.max(rightSideItems.length, 1)),
        side: 'right',
        otif: otifPercentages[i % otifPercentages.length] || 88.5
      };
    });

    const connections = [];
    leftNodes.forEach(left => {
      rightNodes.forEach(right => {
        const existingConnection = chordConnections.find(
          c => c.source === left.id && c.target === right.id
        );
        const value = existingConnection ? existingConnection.value : 20 + Math.floor(Math.random() * 80);
        const movementType = getMovementType(value);
        const stockLevel = getStockLevel(value);
        const thickness = getStockThickness(stockLevel);
        connections.push({
          source: left,
          target: right,
          value: value,
          movementType: movementType,
          stockLevel: stockLevel,
          color: movementColors[movementType],
          strokeWidth: thickness
        });
      });
    });

    const defs = svg.append('defs');

    connections.forEach((conn, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `gradient-${i}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', conn.color)
        .attr('stop-opacity', 0.7);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', conn.color)
        .attr('stop-opacity', 0.3);
    });

    const linksGroup = svg.append('g').attr('class', 'links');

    connections.forEach((conn, i) => {
      const midX = (conn.source.x + conn.target.x) / 2;
      const path = linksGroup.append('path')
        .attr('d', `M ${conn.source.x + 60} ${conn.source.y + 12}
                    C ${midX} ${conn.source.y + 12},
                      ${midX} ${conn.target.y + 10},
                      ${conn.target.x - 10} ${conn.target.y + 10}`)
        .attr('fill', 'none')
        .attr('stroke', conn.color)
        .attr('stroke-width', conn.strokeWidth)
        .attr('opacity', 0.5)
        .attr('class', 'connection-path')
        .style('cursor', 'pointer')
        .on('mouseenter', function(event) {
          d3.select(this).attr('opacity', 0.9).attr('stroke-width', conn.strokeWidth * 1.5);
          const rect = svgRef.current.getBoundingClientRect();
          setTooltipInfo({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top - 60,
            source: conn.source.name,
            target: conn.target.name,
            quantity: conn.value,
            type: conn.movementType
          });
        })
        .on('mouseleave', function() {
          d3.select(this).attr('opacity', 0.8).attr('stroke-width', conn.strokeWidth);
          setTooltipInfo(null);
        });

      // Static ribbons - no animation
    });

    const leftGroup = svg.append('g').attr('class', 'left-nodes');
    leftNodes.forEach(node => {
      const g = leftGroup.append('g')
        .attr('transform', `translate(${node.x - 60}, ${node.y})`)
        .style('cursor', 'pointer')
        .on('click', () => onCategoryClick && onCategoryClick(node));

      g.append('rect')
        .attr('width', 120)
        .attr('height', 45)
        .attr('rx', 8)
        .attr('fill', '#f8fafc')
        .attr('stroke', '#64748b')
        .attr('stroke-width', 2);

      g.append('text')
        .attr('x', 60)
        .attr('y', 18)
        .attr('text-anchor', 'middle')
        .attr('fill', '#1e293b')
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .text(node.name.split(' ')[0]);

      g.append('text')
        .attr('x', 60)
        .attr('y', 32)
        .attr('text-anchor', 'middle')
        .attr('fill', '#3b82f6')
        .attr('font-size', '11px')
        .attr('font-weight', '700')
        .text(`${node.itemCount} items`);
    });

    const rightGroup = svg.append('g').attr('class', 'right-nodes');
    rightNodes.forEach((node) => {
      const g = rightGroup.append('g')
        .attr('transform', `translate(${node.x - 10}, ${node.y})`)
        .style('cursor', 'pointer')
        .on('click', () => {
          if (!selectedL1) {
            setSelectedL1(node.id);
          } else if (!selectedL2) {
            setSelectedL2(node.id);
          }
          onDepartmentClick && onDepartmentClick(node);
        });

      g.append('rect')
        .attr('width', 200)
        .attr('height', 32)
        .attr('rx', 6)
        .attr('fill', '#f8fafc')
        .attr('stroke', '#64748b')
        .attr('stroke-width', 1.5);

      g.append('text')
        .attr('x', 100)
        .attr('y', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#1e293b')
        .attr('font-size', '9px')
        .attr('font-weight', '600')
        .text(node.name.length > 26 ? node.name.substring(0, 24) + '...' : node.name);

      // Add OTIF percentage
      g.append('text')
        .attr('x', 100)
        .attr('y', 26)
        .attr('text-anchor', 'middle')
        .attr('fill', node.otif >= 90 ? '#10b981' : node.otif >= 85 ? '#f59e0b' : '#ef4444')
        .attr('font-size', '9px')
        .attr('font-weight', '700')
        .text(`OTIF: ${node.otif}%`);
    });

  }, [selectedL1, selectedL2, onCategoryClick, onDepartmentClick, rightSideItems]);

  const handleBack = () => {
    if (selectedL2) {
      setSelectedL2(null);
    } else if (selectedL1) {
      setSelectedL1(null);
    }
  };

  const getBreadcrumb = () => {
    const parts = ['Departments'];
    if (selectedL1) {
      const l1 = hospitalDepartments.level1.find(d => d.id === selectedL1);
      if (l1) parts.push(l1.name);
    }
    if (selectedL2) {
      const l2Items = hospitalDepartments.level2[selectedL1] || [];
      const l2 = l2Items.find(d => d.id === selectedL2);
      if (l2) parts.push(l2.name);
    }
    return parts;
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-slate-800 font-semibold">Medicine Category to Department Flow</h3>
          <div className="flex items-center gap-2 mt-1">
            {getBreadcrumb().map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-slate-400">›</span>}
                <span className={`text-xs ${i === getBreadcrumb().length - 1 ? 'text-blue-600' : 'text-slate-500'}`}>
                  {part}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {movementLabels.map((item) => (
              <div key={item.type} className="flex items-center gap-1.5">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
          {(selectedL1 || selectedL2) && (
            <button
              onClick={handleBack}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 transition-colors border border-slate-200"
            >
              ← Back
            </button>
          )}
        </div>
      </div>
      <div className="relative">
        <svg ref={svgRef} className="w-full" style={{ height: '400px' }} />
        {tooltipInfo && (
          <div 
            className="absolute bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-10 pointer-events-none"
            style={{ left: tooltipInfo.x, top: tooltipInfo.y }}
          >
            <div className="text-xs text-slate-500 mb-1">Flow Details</div>
            <div className="text-sm font-medium text-slate-800">{tooltipInfo.source}</div>
            <div className="text-xs text-slate-400 my-1">→</div>
            <div className="text-sm font-medium text-slate-800">{tooltipInfo.target}</div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: movementColors[tooltipInfo.type] }}
              />
              <span className="text-xs text-slate-600">{tooltipInfo.quantity} units</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs capitalize" style={{ color: movementColors[tooltipInfo.type] }}>
                {tooltipInfo.type.replace('-', ' ')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedChordDiagram;
