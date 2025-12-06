import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { Activity, Package, Zap, Heart, Pill, Syringe } from 'lucide-react';

const LiveCircuitFlow = ({ onProductClick }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockLevels, setStockLevels] = useState({});
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });

  const products = useMemo(() => [
    { id: 'cardiac', name: 'Cardiac Medications', icon: Heart, color: '#ef4444', allocated: 1500, unit: 'units' },
    { id: 'emergency', name: 'Emergency Meds', icon: Zap, color: '#f97316', allocated: 800, unit: 'units' },
    { id: 'antibiotics', name: 'Antibiotics', icon: Pill, color: '#22c55e', allocated: 2000, unit: 'units' },
    { id: 'surgical', name: 'Surgical Supplies', icon: Syringe, color: '#8b5cf6', allocated: 600, unit: 'units' }
  ], []);

  const distributionNodes = useMemo(() => [
    { id: 'icu', name: 'ICU', x: 0.45, y: 0.15 },
    { id: 'emergency-ward', name: 'Emergency Ward', x: 0.45, y: 0.35 },
    { id: 'general-ward', name: 'General Ward', x: 0.45, y: 0.55 },
    { id: 'ot', name: 'Operation Theater', x: 0.45, y: 0.75 },
    { id: 'pharmacy', name: 'Pharmacy Store', x: 0.45, y: 0.9 }
  ], []);

  const consumptionNodes = useMemo(() => [
    { id: 'patient-care', name: 'Patient Care', x: 0.85, y: 0.2 },
    { id: 'procedures', name: 'Procedures', x: 0.85, y: 0.4 },
    { id: 'outpatient', name: 'Outpatient', x: 0.85, y: 0.6 },
    { id: 'research', name: 'Research', x: 0.85, y: 0.8 }
  ], []);

  const initializeStockLevels = useCallback(() => {
    const levels = {};
    products.forEach(product => {
      levels[product.id] = {
        current: Math.round(product.allocated * (0.6 + Math.random() * 0.3)),
        rate: Math.round(5 + Math.random() * 15)
      };
    });
    distributionNodes.forEach(node => {
      levels[node.id] = {
        current: Math.round(100 + Math.random() * 300),
        status: ['normal', 'low', 'critical'][Math.floor(Math.random() * 3)]
      };
    });
    consumptionNodes.forEach(node => {
      levels[node.id] = {
        current: Math.round(50 + Math.random() * 150),
        rate: Math.round(2 + Math.random() * 8)
      };
    });
    return levels;
  }, [products, distributionNodes, consumptionNodes]);

  useEffect(() => {
    setStockLevels(initializeStockLevels());
    setSelectedProduct(products[0]);
  }, [initializeStockLevels, products]);

  useEffect(() => {
    const updateLevels = () => {
      setStockLevels(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key].current !== undefined) {
            const change = Math.round((Math.random() - 0.5) * 10);
            updated[key] = {
              ...updated[key],
              current: Math.max(0, updated[key].current + change)
            };
            if (distributionNodes.find(n => n.id === key)) {
              const product = products.find(p => p.id === selectedProduct?.id);
              const threshold = product ? product.allocated * 0.1 : 100;
              updated[key].status = 
                updated[key].current < threshold * 0.3 ? 'critical' :
                updated[key].current < threshold * 0.6 ? 'low' : 'normal';
            }
          }
        });
        return updated;
      });
    };

    const interval = setInterval(updateLevels, 2000);
    return () => clearInterval(interval);
  }, [selectedProduct, distributionNodes, products]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(rect.width, 700),
          height: 550
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !selectedProduct) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const defs = svg.append('defs');

    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%');
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const pulseFilter = defs.append('filter')
      .attr('id', 'pulse-glow');
    pulseFilter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'blur');
    const pulseMerge = pulseFilter.append('feMerge');
    pulseMerge.append('feMergeNode').attr('in', 'blur');
    pulseMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const mainNodeX = width * 0.08;
    const mainNodeY = height * 0.5;
    const mainNodeRadius = 55;

    const mainNode = svg.append('g')
      .attr('class', 'main-node')
      .attr('transform', `translate(${mainNodeX}, ${mainNodeY})`)
      .style('cursor', 'pointer')
      .on('click', () => onProductClick && onProductClick(selectedProduct));

    mainNode.append('circle')
      .attr('r', mainNodeRadius + 8)
      .attr('fill', 'none')
      .attr('stroke', selectedProduct.color)
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.3)
      .attr('filter', 'url(#pulse-glow)');

    mainNode.append('circle')
      .attr('r', mainNodeRadius)
      .attr('fill', `url(#main-gradient)`)
      .attr('stroke', selectedProduct.color)
      .attr('stroke-width', 3)
      .attr('filter', 'url(#glow)');

    const mainGradient = defs.append('radialGradient')
      .attr('id', 'main-gradient');
    mainGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', d3.color(selectedProduct.color).brighter(0.5));
    mainGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', selectedProduct.color);

    mainNode.append('text')
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .text(selectedProduct.name.split(' ')[0]);

    mainNode.append('text')
      .attr('y', 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .attr('class', 'stock-counter')
      .text(stockLevels[selectedProduct.id]?.current || selectedProduct.allocated);

    mainNode.append('text')
      .attr('y', 22)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255,255,255,0.8)')
      .attr('font-size', '10px')
      .text(selectedProduct.unit);

    const pathsGroup = svg.append('g').attr('class', 'paths');

    distributionNodes.forEach((distNode, idx) => {
      const nodeX = width * distNode.x;
      const nodeY = height * distNode.y;
      const stockData = stockLevels[distNode.id] || { current: 100, status: 'normal' };

      const pathData = d3.line()
        .x(d => d[0])
        .y(d => d[1])
        .curve(d3.curveBasis);

      const midX = (mainNodeX + nodeX) / 2;
      const points = [
        [mainNodeX + mainNodeRadius, mainNodeY],
        [midX, mainNodeY],
        [midX, nodeY],
        [nodeX - 35, nodeY]
      ];

      const path = pathsGroup.append('path')
        .attr('d', pathData(points))
        .attr('fill', 'none')
        .attr('stroke', stockData.status === 'critical' ? '#ef4444' : 
                        stockData.status === 'low' ? '#f59e0b' : '#3b82f6')
        .attr('stroke-width', 3)
        .attr('stroke-opacity', 0.4);

      const pathLength = path.node().getTotalLength();

      for (let i = 0; i < 3; i++) {
        const particle = pathsGroup.append('circle')
          .attr('r', 4)
          .attr('fill', selectedProduct.color)
          .attr('filter', 'url(#glow)');

        const animateParticle = () => {
          particle
            .attr('opacity', 1)
            .transition()
            .duration(2000 + i * 500)
            .ease(d3.easeLinear)
            .attrTween('transform', function() {
              return function(t) {
                const point = path.node().getPointAtLength(t * pathLength);
                return `translate(${point.x}, ${point.y})`;
              };
            })
            .attr('opacity', 0)
            .on('end', animateParticle);
        };
        
        setTimeout(animateParticle, i * 700);
      }

      const nodeGroup = svg.append('g')
        .attr('transform', `translate(${nodeX}, ${nodeY})`)
        .style('cursor', 'pointer');

      const statusColor = stockData.status === 'critical' ? '#ef4444' : 
                          stockData.status === 'low' ? '#f59e0b' : '#22c55e';

      nodeGroup.append('rect')
        .attr('x', -35)
        .attr('y', -25)
        .attr('width', 70)
        .attr('height', 50)
        .attr('rx', 8)
        .attr('fill', '#1e293b')
        .attr('stroke', statusColor)
        .attr('stroke-width', 2)
        .attr('filter', stockData.status === 'critical' ? 'url(#pulse-glow)' : 'none');

      nodeGroup.append('text')
        .attr('y', -8)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '9px')
        .attr('font-weight', '500')
        .text(distNode.name);

      nodeGroup.append('text')
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .attr('fill', statusColor)
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text(stockData.current);

      const consNode = consumptionNodes[idx % consumptionNodes.length];
      if (consNode) {
        const consX = width * consNode.x;
        const consY = height * consNode.y;
        const consMidX = (nodeX + consX) / 2;

        const consPoints = [
          [nodeX + 35, nodeY],
          [consMidX, nodeY],
          [consMidX, consY],
          [consX - 30, consY]
        ];

        pathsGroup.append('path')
          .attr('d', pathData(consPoints))
          .attr('fill', 'none')
          .attr('stroke', '#64748b')
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0.3)
          .attr('stroke-dasharray', '5,5');
      }
    });

    consumptionNodes.forEach((node) => {
      const nodeX = width * node.x;
      const nodeY = height * node.y;
      const data = stockLevels[node.id] || { current: 50, rate: 5 };

      const nodeGroup = svg.append('g')
        .attr('transform', `translate(${nodeX}, ${nodeY})`);

      nodeGroup.append('rect')
        .attr('x', -30)
        .attr('y', -20)
        .attr('width', 60)
        .attr('height', 40)
        .attr('rx', 6)
        .attr('fill', '#0f172a')
        .attr('stroke', '#475569')
        .attr('stroke-width', 1);

      nodeGroup.append('text')
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#94a3b8')
        .attr('font-size', '8px')
        .text(node.name);

      nodeGroup.append('text')
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .attr('fill', '#22c55e')
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .text(`${data.rate}/hr`);
    });

    svg.append('text')
      .attr('x', mainNodeX)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .text('SOURCE');

    svg.append('text')
      .attr('x', width * 0.45)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .text('DISTRIBUTION');

    svg.append('text')
      .attr('x', width * 0.85)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .text('CONSUMPTION');

  }, [selectedProduct, dimensions, stockLevels, onProductClick, distributionNodes, consumptionNodes]);

  useEffect(() => {
    if (!svgRef.current || !selectedProduct) return;

    const svg = d3.select(svgRef.current);
    svg.select('.main-node .stock-counter')
      .text(stockLevels[selectedProduct.id]?.current || selectedProduct.allocated);

  }, [stockLevels, selectedProduct]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Live Medicine Flow</h2>
          <p className="text-sm text-slate-500 mt-1">Real-time visualization of medicine distribution</p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-500 animate-pulse" />
          <span className="text-sm text-green-600 font-medium">Live</span>
        </div>
      </div>

      <div className="flex gap-3">
        {products.map((product) => {
          const Icon = product.icon;
          const isSelected = selectedProduct?.id === product.id;
          return (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                isSelected 
                  ? 'border-transparent shadow-lg' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              style={isSelected ? { 
                backgroundColor: product.color,
                color: 'white'
              } : {}}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
              <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                {product.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      <div 
        ref={containerRef}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 overflow-hidden"
      >
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-700">Normal</span>
          </div>
          <p className="text-xs text-green-600">Stock levels within optimal range</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm font-medium text-yellow-700">Low Stock</span>
          </div>
          <p className="text-xs text-yellow-600">Below 60% of threshold</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-red-700">Critical</span>
          </div>
          <p className="text-xs text-red-600">Immediate restocking required</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-3 h-3 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">Flow Rate</span>
          </div>
          <p className="text-xs text-blue-600">Units consumed per hour</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
        <p className="text-sm text-blue-800">
          Click on the main product node to view detailed analytics and trends
        </p>
      </div>
    </div>
  );
};

export default LiveCircuitFlow;
