import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { generateChordData, pharmaCategories } from '../../data/pharmaChordData';

const PharmaChordDiagram = ({ timeframe = 'daily', selectedLabel, onRibbonClick }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [filterType, setFilterType] = useState('areas');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  const chordData = useMemo(() => 
    generateChordData(filterType, timeframe), 
    [filterType, timeframe]
  );

  const movementColors = {
    fast: '#22c55e',
    medium: '#eab308',
    slow: '#f97316',
    occasional: '#ef4444'
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(width - 280, 500),
          height: 500
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !chordData) return;

    const { width, height } = dimensions;
    const margin = { top: 60, right: 160, bottom: 40, left: 160 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const defs = svg.append('defs');
    
    const uniformBlue = '#3b82f6';
    pharmaCategories.forEach(cat => {
      const gradient = defs.append('linearGradient')
        .attr('id', `gradient-${cat.id}`)
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '0%');
      gradient.append('stop').attr('offset', '0%').attr('stop-color', uniformBlue);
      gradient.append('stop').attr('offset', '100%').attr('stop-color', '#2563eb');
    });

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const leftScale = d3.scaleBand()
      .domain(chordData.categories.map(d => d.id))
      .range([0, innerHeight])
      .padding(0.15);

    const rightScale = d3.scaleBand()
      .domain(chordData.destinations.map(d => d.id))
      .range([0, innerHeight])
      .padding(0.15);

    const maxVolume = d3.max(chordData.connections, d => d.volume) || 100;

    const getStrokeWidth = (connection) => {
      const baseWidth = (connection.volume / maxVolume) * 20;
      const consumptionMultiplier = {
        over: 1.5,
        normal: 1,
        under: 0.6,
        dead: 0.3
      };
      return Math.max(2, baseWidth * (consumptionMultiplier[connection.consumption] || 1));
    };

    const getRibbonColor = (movement) => {
      return movementColors[movement] || movementColors.medium;
    };

    const linksGroup = g.append('g').attr('class', 'ribbons');

    const createCurvedPath = (source, target, sourceY, targetY, sourceHeight, targetHeight) => {
      const x0 = 0;
      const x1 = innerWidth;
      const controlOffset = innerWidth * 0.4;
      
      const path = d3.path();
      path.moveTo(x0, sourceY);
      path.bezierCurveTo(
        x0 + controlOffset, sourceY,
        x1 - controlOffset, targetY,
        x1, targetY
      );
      path.lineTo(x1, targetY + targetHeight);
      path.bezierCurveTo(
        x1 - controlOffset, targetY + targetHeight,
        x0 + controlOffset, sourceY + sourceHeight,
        x0, sourceY + sourceHeight
      );
      path.closePath();
      
      return path.toString();
    };

    const groupedConnections = {};
    chordData.connections.forEach(conn => {
      const key = `${conn.source}-${conn.target}`;
      if (!groupedConnections[key]) {
        groupedConnections[key] = conn;
      }
    });

    Object.values(groupedConnections).forEach(connection => {
      const sourceY = leftScale(connection.source);
      const targetY = rightScale(connection.target);
      if (sourceY === undefined || targetY === undefined) return;

      const strokeWidth = getStrokeWidth(connection);
      const fillColor = getRibbonColor(connection.movement);

      linksGroup.append('path')
        .attr('d', createCurvedPath(
          connection.source, connection.target,
          sourceY + leftScale.bandwidth() / 2 - strokeWidth / 2,
          targetY + rightScale.bandwidth() / 2 - strokeWidth / 2,
          strokeWidth,
          strokeWidth
        ))
        .attr('fill', fillColor)
        .attr('fill-opacity', 0.7)
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          d3.select(this).attr('fill-opacity', 0.95);
          setHoveredItem({
            type: 'ribbon',
            source: connection.sourceName,
            target: connection.targetName,
            volume: connection.volume,
            consumption: connection.consumption,
            movement: connection.movement
          });
        })
        .on('mouseout', function() {
          d3.select(this).attr('fill-opacity', 0.7);
          setHoveredItem(null);
        })
        .on('click', function() {
          if (onRibbonClick) {
            onRibbonClick({
              source: connection.sourceName,
              target: connection.targetName,
              volume: connection.volume,
              consumption: connection.consumption,
              movement: connection.movement,
              labelContext: selectedLabel
            });
          }
        });
    });

    const leftNodesGroup = g.append('g').attr('class', 'left-nodes');

    leftNodesGroup.selectAll('.left-bar')
      .data(chordData.categories)
      .join('rect')
      .attr('class', 'left-bar')
      .attr('x', -15)
      .attr('y', d => leftScale(d.id))
      .attr('width', 15)
      .attr('height', leftScale.bandwidth())
      .attr('rx', 4)
      .attr('fill', uniformBlue)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
        setHoveredItem({
          type: 'category',
          name: d.name,
          color: uniformBlue
        });
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        setHoveredItem(null);
      });

    leftNodesGroup.selectAll('.left-label')
      .data(chordData.categories)
      .join('text')
      .attr('class', 'left-label')
      .attr('x', -22)
      .attr('y', d => leftScale(d.id) + leftScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('fill', '#1e293b')
      .text(d => d.name);

    const rightNodesGroup = g.append('g').attr('class', 'right-nodes');

    rightNodesGroup.selectAll('.right-bar')
      .data(chordData.destinations)
      .join('rect')
      .attr('class', 'right-bar')
      .attr('x', innerWidth)
      .attr('y', d => rightScale(d.id))
      .attr('width', 15)
      .attr('height', rightScale.bandwidth())
      .attr('rx', 4)
      .attr('fill', '#3b82f6')
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
        setHoveredItem({
          type: 'destination',
          name: d.name
        });
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        setHoveredItem(null);
      });

    rightNodesGroup.selectAll('.right-label')
      .data(chordData.destinations)
      .join('text')
      .attr('class', 'right-label')
      .attr('x', innerWidth + 22)
      .attr('y', d => rightScale(d.id) + rightScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'start')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('fill', '#1e293b')
      .text(d => d.name);

  }, [chordData, dimensions, timeframe, selectedLabel, onRibbonClick]);

  const filterOptions = [
    { value: 'areas', label: 'Areas' },
    { value: 'specialities', label: 'Specialities' },
    { value: 'wards', label: 'Wards' }
  ];

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600">Movement Speed:</span>
            {[
              { label: 'Fast', color: '#22c55e' },
              { label: 'Medium', color: '#eab308' },
              { label: 'Slow', color: '#f97316' },
              { label: 'Occasional', color: '#ef4444' }
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Filter by:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 relative">
          <div className="absolute top-2 right-4 flex items-center gap-4 text-xs">
            <span className="font-medium text-slate-600">Thickness = Consumption:</span>
            {[
              { label: 'Over', width: 'w-6' },
              { label: 'Normal', width: 'w-4' },
              { label: 'Under', width: 'w-2' }
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1">
                <div className={`${item.width} h-1.5 bg-slate-400 rounded`} />
                <span className="text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
          <p className="absolute top-2 left-4 text-xs text-blue-600 font-medium">
            Click on ribbons to view RCA & Recommendations
          </p>
          <svg ref={svgRef} className="w-full" style={{ marginTop: '20px' }} />
        </div>

        {hoveredItem && (
          <div className="w-56 bg-slate-900 text-white rounded-xl p-4 shadow-lg self-start">
            <h4 className="font-semibold mb-3 text-blue-300">
              {hoveredItem.type === 'ribbon' ? 'Flow Details' : 
               hoveredItem.type === 'category' ? 'Medicine Category' : 'Destination'}
            </h4>
            {hoveredItem.type === 'ribbon' && (
              <div className="space-y-2 text-sm">
                <p><span className="text-slate-400">From:</span> {hoveredItem.source}</p>
                <p><span className="text-slate-400">To:</span> {hoveredItem.target}</p>
                <p><span className="text-slate-400">Volume:</span> {hoveredItem.volume} units</p>
                <p><span className="text-slate-400">Movement:</span> 
                  <span className="ml-1 px-2 py-0.5 rounded text-xs" 
                    style={{ backgroundColor: movementColors[hoveredItem.movement] }}>
                    {hoveredItem.movement}
                  </span>
                </p>
                <p><span className="text-slate-400">Status:</span> 
                  <span className={`ml-1 px-2 py-0.5 rounded text-xs ${
                    hoveredItem.consumption === 'over' ? 'bg-red-500' :
                    hoveredItem.consumption === 'under' ? 'bg-yellow-500' :
                    hoveredItem.consumption === 'dead' ? 'bg-slate-500' : 'bg-green-500'
                  }`}>
                    {hoveredItem.consumption === 'over' ? 'Over Consumption' :
                     hoveredItem.consumption === 'under' ? 'Under Consumption' :
                     hoveredItem.consumption === 'dead' ? 'Dead Stock' : 'Normal'}
                  </span>
                </p>
              </div>
            )}
            {hoveredItem.type === 'category' && (
              <div className="space-y-2 text-sm">
                <p><span className="text-slate-400">Name:</span> {hoveredItem.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Color:</span>
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: hoveredItem.color }} />
                </div>
              </div>
            )}
            {hoveredItem.type === 'destination' && (
              <div className="space-y-2 text-sm">
                <p><span className="text-slate-400">Location:</span> {hoveredItem.name}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmaChordDiagram;