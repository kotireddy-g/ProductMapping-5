import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { ChevronRight, Home } from 'lucide-react';
import { movementColors, consumptionWidths, getMovementLabel, getConsumptionLabel } from '../data/hierarchicalData';

const BipartiteChord = ({ data, selectedVertical }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [drillPath, setDrillPath] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });

  const getCurrentLevel = useCallback(() => {
    if (drillPath.length === 0) return 'category';
    const levels = ['subcategory', 'type', 'brand', 'product'];
    return levels[Math.min(drillPath.length - 1, levels.length - 1)] || 'product';
  }, [drillPath]);

  const getLeftItems = useCallback(() => {
    if (!data || !data.categories) return [];
    
    let items = data.categories;
    
    for (let i = 0; i < drillPath.length; i++) {
      const path = drillPath[i];
      const item = items.find(c => c.id === path.id);
      if (!item) return [];
      
      if (item.subcategories && item.subcategories.length > 0) {
        items = item.subcategories;
      } else if (item.types && item.types.length > 0) {
        items = item.types;
      } else if (item.brands && item.brands.length > 0) {
        items = item.brands;
      } else if (item.products && item.products.length > 0) {
        items = item.products;
      } else {
        return [item];
      }
    }
    
    return items || [];
  }, [data, drillPath]);

  const hasChildren = useCallback((item) => {
    return (item.subcategories && item.subcategories.length > 0) ||
           (item.types && item.types.length > 0) ||
           (item.brands && item.brands.length > 0) ||
           (item.products && item.products.length > 0);
  }, []);

  const getItemAreas = useCallback((item) => {
    if (item.connectedAreas && item.connectedAreas.length > 0) {
      return data.areas.filter(area => item.connectedAreas.includes(area.id));
    }
    return [];
  }, [data]);

  const getFlowData = useCallback((item, areaId) => {
    if (item.areaFlows && item.areaFlows[areaId]) {
      return item.areaFlows[areaId];
    }
    return null;
  }, []);

  const handleItemClick = useCallback((item) => {
    if (hasChildren(item)) {
      setDrillPath(prev => [...prev, { id: item.id, name: item.name }]);
    }
  }, [hasChildren]);

  const handleBreadcrumbClick = useCallback((index) => {
    if (index === -1) {
      setDrillPath([]);
    } else {
      setDrillPath(prev => prev.slice(0, index + 1));
    }
  }, []);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const leftItems = getLeftItems();
    
    if (leftItems.length === 0) return;

    const allConnectedAreaIds = new Set();
    leftItems.forEach(item => {
      if (item.connectedAreas) {
        item.connectedAreas.forEach(areaId => allConnectedAreaIds.add(areaId));
      }
    });
    
    const rightItems = data.areas.filter(area => allConnectedAreaIds.has(area.id));
    
    if (rightItems.length === 0) return;

    const width = dimensions.width;
    const height = Math.max(dimensions.height, leftItems.length * 50, rightItems.length * 50);
    const margin = { top: 40, right: 180, bottom: 40, left: 180 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto;');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const leftScale = d3.scaleBand()
      .domain(leftItems.map(d => d.id))
      .range([0, innerHeight])
      .padding(0.2);

    const rightScale = d3.scaleBand()
      .domain(rightItems.map(d => d.id))
      .range([0, innerHeight])
      .padding(0.2);

    const connections = [];
    leftItems.forEach(leftItem => {
      const connectedAreas = getItemAreas(leftItem);
      connectedAreas.forEach(area => {
        const flowData = getFlowData(leftItem, area.id);
        if (flowData) {
          connections.push({
            source: leftItem,
            target: area,
            volume: flowData.volume,
            consumption: flowData.consumption,
            movement: leftItem.movement || 'medium'
          });
        }
      });
    });

    if (connections.length === 0) return;

    const maxVolume = d3.max(connections, d => d.volume) || 100;
    
    const getWidthFromConsumption = (consumption, volume) => {
      const config = consumptionWidths[consumption] || consumptionWidths.normal;
      const normalizedVolume = volume / maxVolume;
      return config.base + (normalizedVolume * 8 * config.multiplier);
    };

    const getConsumptionOpacity = (consumption) => {
      const opacities = { over: 0.9, normal: 0.7, under: 0.5 };
      return opacities[consumption] || 0.7;
    };

    const linkGenerator = d3.linkHorizontal()
      .source(d => [0, leftScale(d.source.id) + leftScale.bandwidth() / 2])
      .target(d => [innerWidth, rightScale(d.target.id) + rightScale.bandwidth() / 2]);

    const linksGroup = g.append('g').attr('class', 'links');

    linksGroup.selectAll('path')
      .data(connections)
      .join('path')
      .attr('d', linkGenerator)
      .attr('fill', 'none')
      .attr('stroke', d => movementColors[d.movement] || '#94a3b8')
      .attr('stroke-width', d => getWidthFromConsumption(d.consumption, d.volume))
      .attr('stroke-opacity', d => getConsumptionOpacity(d.consumption))
      .attr('stroke-linecap', 'round')
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('stroke-opacity', 1)
          .attr('stroke-width', getWidthFromConsumption(d.consumption, d.volume) + 4);
        
        setHoveredItem({
          type: 'connection',
          source: d.source.name,
          target: d.target.name,
          volume: d.volume,
          movement: d.movement,
          consumption: d.consumption
        });
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .attr('stroke-opacity', getConsumptionOpacity(d.consumption))
          .attr('stroke-width', getWidthFromConsumption(d.consumption, d.volume));
        setHoveredItem(null);
      });

    const leftNodesGroup = g.append('g').attr('class', 'left-nodes');

    leftNodesGroup.selectAll('rect')
      .data(leftItems)
      .join('rect')
      .attr('x', -12)
      .attr('y', d => leftScale(d.id))
      .attr('width', 12)
      .attr('height', leftScale.bandwidth())
      .attr('rx', 4)
      .attr('fill', d => movementColors[d.movement] || '#64748b')
      .style('cursor', d => hasChildren(d) ? 'pointer' : 'default')
      .on('click', (event, d) => handleItemClick(d))
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
        linksGroup.selectAll('path')
          .attr('stroke-opacity', link => link.source.id === d.id ? 1 : 0.1);
        setHoveredItem({
          type: 'category',
          name: d.name,
          movement: d.movement,
          totalVolume: d.totalVolume,
          consumption: d.consumption,
          hasChildren: hasChildren(d)
        });
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        linksGroup.selectAll('path')
          .attr('stroke-opacity', d => getConsumptionOpacity(d.consumption));
        setHoveredItem(null);
      });

    leftNodesGroup.selectAll('text')
      .data(leftItems)
      .join('text')
      .attr('x', -20)
      .attr('y', d => leftScale(d.id) + leftScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('font-size', '13px')
      .attr('font-weight', '500')
      .attr('fill', '#1e293b')
      .style('cursor', d => hasChildren(d) ? 'pointer' : 'default')
      .text(d => d.name)
      .on('click', (event, d) => handleItemClick(d))
      .on('mouseover', function(event, d) {
        linksGroup.selectAll('path')
          .attr('stroke-opacity', link => link.source.id === d.id ? 1 : 0.1);
      })
      .on('mouseout', function() {
        linksGroup.selectAll('path')
          .attr('stroke-opacity', d => getConsumptionOpacity(d.consumption));
      });

    leftNodesGroup.selectAll('.drill-indicator')
      .data(leftItems.filter(d => hasChildren(d)))
      .join('text')
      .attr('class', 'drill-indicator')
      .attr('x', 8)
      .attr('y', d => leftScale(d.id) + leftScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('font-size', '12px')
      .attr('fill', '#3b82f6')
      .style('cursor', 'pointer')
      .text('>')
      .on('click', (event, d) => handleItemClick(d));

    const rightNodesGroup = g.append('g').attr('class', 'right-nodes');

    rightNodesGroup.selectAll('rect')
      .data(rightItems)
      .join('rect')
      .attr('x', innerWidth)
      .attr('y', d => rightScale(d.id))
      .attr('width', 12)
      .attr('height', rightScale.bandwidth())
      .attr('rx', 4)
      .attr('fill', '#3b82f6')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
        linksGroup.selectAll('path')
          .attr('stroke-opacity', link => link.target.id === d.id ? 1 : 0.1);
        
        const connectedFlows = connections.filter(c => c.target.id === d.id);
        const totalVolume = connectedFlows.reduce((sum, c) => sum + c.volume, 0);
        
        setHoveredItem({
          type: 'area',
          name: d.name,
          areaType: d.type,
          connectedCategories: connectedFlows.length,
          totalVolume: totalVolume
        });
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        linksGroup.selectAll('path')
          .attr('stroke-opacity', d => getConsumptionOpacity(d.consumption));
        setHoveredItem(null);
      });

    rightNodesGroup.selectAll('text')
      .data(rightItems)
      .join('text')
      .attr('x', innerWidth + 20)
      .attr('y', d => rightScale(d.id) + rightScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'start')
      .attr('font-size', '13px')
      .attr('font-weight', '500')
      .attr('fill', '#1e293b')
      .text(d => d.name)
      .on('mouseover', function(event, d) {
        linksGroup.selectAll('path')
          .attr('stroke-opacity', link => link.target.id === d.id ? 1 : 0.1);
      })
      .on('mouseout', function() {
        linksGroup.selectAll('path')
          .attr('stroke-opacity', d => getConsumptionOpacity(d.consumption));
      });

  }, [data, drillPath, dimensions, getLeftItems, getItemAreas, getFlowData, handleItemClick, hasChildren]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(width, 600),
          height: 500
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const levelLabels = {
    category: 'Categories',
    subcategory: 'Subcategories',
    type: 'Types',
    brand: 'Brands',
    product: 'Products'
  };

  return (
    <div ref={containerRef} className="w-full">
      {drillPath.length > 0 && (
        <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => handleBreadcrumbClick(-1)}
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>All Categories</span>
          </button>
          {drillPath.map((item, index) => (
            <React.Fragment key={item.id}>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className={`font-medium transition-colors ${
                  index === drillPath.length - 1
                    ? 'text-slate-700'
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                {item.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="flex gap-6">
        <div className="flex-1 relative bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {levelLabels[getCurrentLevel()]}
              </h3>
              {drillPath.length === 0 && (
                <span className="text-sm text-slate-500">Click category to drill down</span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Areas / Locations</h3>
          </div>
          
          <svg ref={svgRef} className="w-full" />
        </div>

        <div className="w-64 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h4 className="font-semibold text-slate-800 mb-3">Movement Speed</h4>
            <div className="space-y-2">
              {Object.entries(movementColors).map(([key, color]) => (
                <div key={key} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-slate-600">{getMovementLabel(key)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h4 className="font-semibold text-slate-800 mb-3">Consumption Level</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-4 bg-slate-400 rounded" />
                <span className="text-sm text-slate-600">Over Consumption</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-2 bg-slate-400 rounded" />
                <span className="text-sm text-slate-600">Normal</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-1 bg-slate-400 rounded" />
                <span className="text-sm text-slate-600">Under Consumption</span>
              </div>
            </div>
          </div>

          {hoveredItem && (
            <div className="bg-slate-900 text-white rounded-xl p-4 shadow-lg">
              <h4 className="font-semibold mb-2 text-blue-300">
                {hoveredItem.type === 'connection' ? 'Flow Details' : 
                 hoveredItem.type === 'category' ? getCurrentLevel().charAt(0).toUpperCase() + getCurrentLevel().slice(1) : 'Location'}
              </h4>
              {hoveredItem.type === 'connection' && (
                <div className="space-y-1.5 text-sm">
                  <p><span className="text-slate-400">From:</span> {hoveredItem.source}</p>
                  <p><span className="text-slate-400">To:</span> {hoveredItem.target}</p>
                  <p><span className="text-slate-400">Volume:</span> {hoveredItem.volume} units</p>
                  <p><span className="text-slate-400">Speed:</span> 
                    <span className="ml-1 px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: movementColors[hoveredItem.movement] }}>
                      {getMovementLabel(hoveredItem.movement)}
                    </span>
                  </p>
                  <p><span className="text-slate-400">Status:</span> {getConsumptionLabel(hoveredItem.consumption)}</p>
                </div>
              )}
              {hoveredItem.type === 'category' && (
                <div className="space-y-1.5 text-sm">
                  <p><span className="text-slate-400">Name:</span> {hoveredItem.name}</p>
                  <p><span className="text-slate-400">Total Volume:</span> {hoveredItem.totalVolume} units</p>
                  <p><span className="text-slate-400">Speed:</span> 
                    <span className="ml-1 px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: movementColors[hoveredItem.movement] }}>
                      {getMovementLabel(hoveredItem.movement)}
                    </span>
                  </p>
                  <p><span className="text-slate-400">Status:</span> {getConsumptionLabel(hoveredItem.consumption)}</p>
                  {hoveredItem.hasChildren && (
                    <p className="text-blue-400 mt-2 pt-2 border-t border-slate-700">Click to drill down</p>
                  )}
                </div>
              )}
              {hoveredItem.type === 'area' && (
                <div className="space-y-1.5 text-sm">
                  <p><span className="text-slate-400">Name:</span> {hoveredItem.name}</p>
                  <p><span className="text-slate-400">Type:</span> {hoveredItem.areaType}</p>
                  <p><span className="text-slate-400">Connected:</span> {hoveredItem.connectedCategories} items</p>
                  <p><span className="text-slate-400">Total Volume:</span> {hoveredItem.totalVolume} units</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BipartiteChord;
