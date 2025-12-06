import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { Heart, Zap, Pill, Syringe, Shield, Activity } from 'lucide-react';

const EnhancedCircuitFlow = ({ selectedLabel, onProductClick }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [selectedCategory, setSelectedCategory] = useState('emergency');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockLevels, setStockLevels] = useState({});
  const [dimensions, setDimensions] = useState({ width: 900, height: 650 });

  const categories = useMemo(() => [
    { id: 'emergency', name: 'Emergency Medicines', icon: Zap, color: '#ef4444' },
    { id: 'ot', name: 'OT Medicines', icon: Syringe, color: '#8b5cf6' },
    { id: 'ward', name: 'Ward Medicines', icon: Heart, color: '#ec4899' },
    { id: 'daycare', name: 'Daycare Medicines', icon: Activity, color: '#06b6d4' },
    { id: 'general', name: 'General Medicines', icon: Pill, color: '#22c55e' },
    { id: 'implant', name: 'Implant Medicines', icon: Shield, color: '#f59e0b' }
  ], []);

  const products = useMemo(() => ({
    emergency: [
      { id: 'adrenaline', name: 'Adrenaline 1mg/ml', allocated: 500, unit: 'units' },
      { id: 'atropine', name: 'Atropine 0.6mg', allocated: 300, unit: 'units' }
    ],
    ot: [
      { id: 'propofol', name: 'Propofol 200mg', allocated: 400, unit: 'vials' },
      { id: 'fentanyl', name: 'Fentanyl 50mcg', allocated: 250, unit: 'ampules' }
    ],
    ward: [
      { id: 'insulin', name: 'Insulin Regular', allocated: 800, unit: 'units' },
      { id: 'heparin', name: 'Heparin 5000IU', allocated: 600, unit: 'vials' }
    ],
    daycare: [
      { id: 'paracetamol', name: 'Paracetamol 500mg', allocated: 2000, unit: 'tablets' },
      { id: 'ibuprofen', name: 'Ibuprofen 400mg', allocated: 1500, unit: 'tablets' }
    ],
    general: [
      { id: 'amoxicillin', name: 'Amoxicillin 500mg', allocated: 3000, unit: 'capsules' },
      { id: 'omeprazole', name: 'Omeprazole 20mg', allocated: 2500, unit: 'capsules' }
    ],
    implant: [
      { id: 'bone-cement', name: 'Bone Cement', allocated: 100, unit: 'kits' },
      { id: 'mesh', name: 'Surgical Mesh', allocated: 150, unit: 'units' }
    ]
  }), []);

  const distributionNodes = useMemo(() => [
    { id: 'icu', name: 'ICU', x: 0.35, y: 0.15 },
    { id: 'emergency-ward', name: 'Emergency Ward', x: 0.35, y: 0.35 },
    { id: 'general-ward', name: 'General Ward', x: 0.35, y: 0.55 },
    { id: 'ot', name: 'Operation Theater', x: 0.35, y: 0.75 },
    { id: 'pharmacy', name: 'Pharmacy Store', x: 0.35, y: 0.9 }
  ], []);

  const usageNodes = useMemo(() => [
    { id: 'icu-usage', name: 'ICU Usage', x: 0.55, y: 0.15 },
    { id: 'emergency-usage', name: 'Emergency Usage', x: 0.55, y: 0.35 },
    { id: 'general-usage', name: 'General Usage', x: 0.55, y: 0.55 },
    { id: 'ot-usage', name: 'OT Usage', x: 0.55, y: 0.75 },
    { id: 'pharmacy-usage', name: 'Pharmacy Usage', x: 0.55, y: 0.9 }
  ], []);

  const stockNodes = useMemo(() => [
    { id: 'icu-stock', name: 'ICU Stock', x: 0.75, y: 0.15 },
    { id: 'emergency-stock', name: 'Emergency Stock', x: 0.75, y: 0.35 },
    { id: 'general-stock', name: 'General Stock', x: 0.75, y: 0.55 },
    { id: 'ot-stock', name: 'OT Stock', x: 0.75, y: 0.75 },
    { id: 'pharmacy-stock', name: 'Pharmacy Stock', x: 0.75, y: 0.9 }
  ], []);

  const consumptionNodes = useMemo(() => [
    { id: 'patient-care', name: 'Patient Care', x: 0.92, y: 0.25 },
    { id: 'procedures', name: 'Procedures', x: 0.92, y: 0.5 },
    { id: 'outpatient', name: 'Outpatient', x: 0.92, y: 0.75 }
  ], []);

  const initializeStockLevels = useCallback(() => {
    const levels = {};
    const currentProducts = products[selectedCategory] || [];
    currentProducts.forEach(product => {
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
    usageNodes.forEach(node => {
      const expected = 100 + Math.random() * 200;
      const actual = expected * (0.7 + Math.random() * 0.6);
      const ratio = actual / expected;
      levels[node.id] = {
        used: Math.round(actual),
        expected: Math.round(expected),
        status: ratio > 1.2 ? 'over' : ratio < 0.8 ? 'under' : 'normal'
      };
    });
    stockNodes.forEach(node => {
      const maxStock = 300;
      const current = Math.round(50 + Math.random() * 250);
      const percentage = (current / maxStock) * 100;
      levels[node.id] = {
        current,
        maxStock,
        status: percentage < 30 ? 'critical' : percentage < 60 ? 'low' : 'normal'
      };
    });
    consumptionNodes.forEach(node => {
      levels[node.id] = {
        current: Math.round(50 + Math.random() * 150),
        rate: Math.round(2 + Math.random() * 8)
      };
    });
    return levels;
  }, [selectedCategory, products, distributionNodes, usageNodes, stockNodes, consumptionNodes]);

  useEffect(() => {
    setStockLevels(initializeStockLevels());
    const currentProducts = products[selectedCategory] || [];
    if (currentProducts.length > 0) {
      setSelectedProduct(currentProducts[0]);
    }
  }, [initializeStockLevels, selectedCategory, products]);

  useEffect(() => {
    const updateLevels = () => {
      setStockLevels(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key].current !== undefined) {
            const change = Math.round((Math.random() - 0.5) * 8);
            updated[key] = {
              ...updated[key],
              current: Math.max(0, updated[key].current + change)
            };
          }
        });
        return updated;
      });
    };
    const interval = setInterval(updateLevels, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: Math.max(rect.width, 700), height: 650 });
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
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const category = categories.find(c => c.id === selectedCategory);
    const nodeColor = '#64748b';

    const mainNodeX = width * 0.08;
    const mainNodeY = height * 0.5;
    const mainNodeRadius = 50;

    const mainNode = svg.append('g')
      .attr('transform', `translate(${mainNodeX}, ${mainNodeY})`)
      .style('cursor', 'pointer');

    mainNode.append('circle')
      .attr('r', mainNodeRadius)
      .attr('fill', nodeColor)
      .attr('stroke', category.color)
      .attr('stroke-width', 3)
      .attr('filter', 'url(#glow)');

    mainNode.append('text')
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .text(selectedProduct.name.substring(0, 12));

    mainNode.append('text')
      .attr('y', 8)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text(`${selectedProduct.allocated}`);

    mainNode.append('text')
      .attr('y', 22)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255,255,255,0.7)')
      .attr('font-size', '9px')
      .text(selectedProduct.unit);

    const getStatusColor = (status) => {
      switch (status) {
        case 'over': return '#ef4444';
        case 'under': return '#eab308';
        case 'critical': return '#ef4444';
        case 'low': return '#eab308';
        default: return '#22c55e';
      }
    };

    const drawNode = (node, level, levelColor, showStatus = false, statusKey = 'status') => {
      const x = node.x * width;
      const y = node.y * height;
      const nodeData = stockLevels[node.id] || {};
      const status = nodeData[statusKey] || 'normal';
      const fillColor = showStatus ? getStatusColor(status) : levelColor;

      const g = svg.append('g')
        .attr('transform', `translate(${x}, ${y})`)
        .style('cursor', 'pointer');

      g.append('rect')
        .attr('x', -45)
        .attr('y', -25)
        .attr('width', 90)
        .attr('height', 50)
        .attr('rx', 8)
        .attr('fill', fillColor)
        .attr('opacity', 0.9);

      g.append('text')
        .attr('y', -8)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '10px')
        .attr('font-weight', '500')
        .text(node.name.substring(0, 12));

      if (nodeData.used !== undefined) {
        g.append('text')
          .attr('y', 10)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .text(`Used: ${nodeData.used}`);
      } else if (nodeData.current !== undefined) {
        g.append('text')
          .attr('y', 10)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .text(`Stock: ${nodeData.current}`);
      }

      return { x, y };
    };

    const distPositions = distributionNodes.map(node => drawNode(node, 2, '#64748b'));
    const usagePositions = usageNodes.map(node => drawNode(node, 3, '#64748b', true, 'status'));
    const stockPositions = stockNodes.map(node => drawNode(node, 4, '#64748b', true, 'status'));
    const consPositions = consumptionNodes.map(node => drawNode(node, 5, '#3b82f6'));

    const drawConnection = (from, to, color = '#94a3b8') => {
      const line = svg.append('line')
        .attr('x1', from.x + 45)
        .attr('y1', from.y)
        .attr('x2', to.x - 45)
        .attr('y2', to.y)
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('opacity', 0.5);
    };

    distPositions.forEach(pos => {
      drawConnection({ x: mainNodeX + mainNodeRadius, y: mainNodeY }, pos);
    });

    distPositions.forEach((distPos, i) => {
      if (usagePositions[i]) {
        drawConnection(distPos, usagePositions[i]);
      }
    });

    usagePositions.forEach((usagePos, i) => {
      if (stockPositions[i]) {
        drawConnection(usagePos, stockPositions[i]);
      }
    });

    stockPositions.forEach((stockPos, i) => {
      consPositions.forEach(consPos => {
        if (Math.random() > 0.5) {
          drawConnection(stockPos, consPos, '#3b82f6');
        }
      });
    });

    const createParticle = () => {
      const pathIndex = Math.floor(Math.random() * distPositions.length);
      const targetPos = distPositions[pathIndex];
      
      const particle = svg.append('circle')
        .attr('r', 4)
        .attr('fill', category.color)
        .attr('cx', mainNodeX + mainNodeRadius)
        .attr('cy', mainNodeY);

      particle.transition()
        .duration(4000)
        .ease(d3.easeLinear)
        .attr('cx', targetPos.x - 45)
        .attr('cy', targetPos.y)
        .on('end', function() {
          d3.select(this).remove();
        });
    };

    const particleInterval = setInterval(createParticle, 800);

    return () => {
      clearInterval(particleInterval);
    };

  }, [selectedProduct, dimensions, selectedCategory, stockLevels, categories, distributionNodes, usageNodes, stockNodes, consumptionNodes]);

  const currentProducts = products[selectedCategory] || [];

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                isSelected 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.name}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 mb-4">
        {currentProducts.map((product) => (
          <button
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedProduct?.id === product.id
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {product.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-xs">
            <span className="font-medium text-slate-600">Usage Status:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className="text-slate-500">Normal (80-120%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-500" />
              <span className="text-slate-500">Under (&lt;80%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span className="text-slate-500">Over (&gt;120%)</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="font-medium text-slate-600">Stock Level:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className="text-slate-500">&gt;60%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-500" />
              <span className="text-slate-500">30-60%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span className="text-slate-500">&lt;30%</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-slate-500 mb-2 px-4">
          <span>Level 1: Product</span>
          <span>Level 2: Distribution</span>
          <span>Level 3: Usage Count</span>
          <span>Level 4: Available Stock</span>
          <span>Level 5: Consumption</span>
        </div>
        
        <svg ref={svgRef} className="w-full" />
      </div>
    </div>
  );
};

export default EnhancedCircuitFlow;