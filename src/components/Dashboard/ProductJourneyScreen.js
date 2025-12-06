import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Heart, AlertTriangle, Pill, Scissors, Building2, Sun } from 'lucide-react';
import { productJourneyData, medicineCategories } from '../../data/unifiedPharmaData';

const ProductJourneyScreen = ({ category, onBack }) => {
  const getCategoryById = (catId) => {
    return medicineCategories.find(c => c.id === catId) || medicineCategories[0];
  };
  
  const initialCategoryId = () => {
    if (category?.id) {
      return category.id;
    }
    if (category?.name) {
      const found = medicineCategories.find(c => c.name === category.name);
      return found ? found.id : medicineCategories[0].id;
    }
    return medicineCategories[0].id;
  };
  
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId());
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  const selectedCategory = getCategoryById(selectedCategoryId);
  
  const getProductData = () => {
    const cat = selectedCategory;
    const totalUnits = cat.itemCount;
    const icuPct = 0.12, emergencyPct = 0.22, generalPct = 0.28, otPct = 0.20, pharmacyPct = 0.18;
    return {
      name: cat.name.replace(' Medicines', ''),
      totalUnits: totalUnits,
      distribution: [
        { name: 'ICU', units: Math.round(totalUnits * icuPct), color: '#ef4444', type: 'critical' },
        { name: 'Emergency Ward', units: Math.round(totalUnits * emergencyPct), color: '#ef4444', type: 'critical' },
        { name: 'General Ward', units: Math.round(totalUnits * generalPct), color: '#10b981', type: 'normal' },
        { name: 'Operation Theater', units: Math.round(totalUnits * otPct), color: '#3b82f6', type: 'routine' },
        { name: 'Pharmacy Store', units: Math.round(totalUnits * pharmacyPct), color: '#3b82f6', type: 'routine' }
      ],
      consumption: [
        { name: 'Patient Care', rate: Math.round(totalUnits * 0.008), unit: '/hr' },
        { name: 'Procedures', rate: Math.round(totalUnits * 0.005), unit: '/hr' },
        { name: 'Outpatient', rate: Math.round(totalUnits * 0.004), unit: '/hr' },
        { name: 'Research', rate: Math.round(totalUnits * 0.002), unit: '/hr' }
      ]
    };
  };
  
  const currentProduct = getProductData();

  const categoryIcons = {
    emergency: AlertTriangle,
    ot: Scissors,
    ward: Building2,
    daycare: Sun,
    general: Pill,
    implant: Heart
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const width = rect.width;
    const height = rect.height;

    const sourceX = 120;
    const sourceY = height / 2;
    const distributionX = width / 2;
    const consumptionX = width - 80;

    const distributionNodes = currentProduct.distribution.map((node, i) => ({
      ...node,
      x: distributionX,
      y: 60 + i * 70,
    }));

    const consumptionNodes = currentProduct.consumption.map((node, i) => ({
      ...node,
      x: consumptionX,
      y: 80 + i * 85,
    }));

    class Particle {
      constructor(startX, startY, endX, endY, color, speed) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.color = color;
        this.speed = speed;
        this.progress = Math.random();
        this.size = 3 + Math.random() * 2;
      }

      update() {
        this.progress += this.speed;
        if (this.progress > 1) this.progress = 0;
      }

      draw(ctx) {
        const midX = (this.startX + this.endX) / 2;
        const t = this.progress;
        
        const x = (1 - t) * (1 - t) * this.startX + 2 * (1 - t) * t * midX + t * t * this.endX;
        const y = (1 - t) * (1 - t) * this.startY + 2 * (1 - t) * t * ((this.startY + this.endY) / 2) + t * t * this.endY;

        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    particlesRef.current = [];
    
    distributionNodes.forEach(node => {
      for (let i = 0; i < 5; i++) {
        particlesRef.current.push(
          new Particle(sourceX + 60, sourceY, node.x - 50, node.y + 20, node.color, 0.003 + Math.random() * 0.004)
        );
      }
    });

    distributionNodes.forEach((distNode, di) => {
      consumptionNodes.forEach((consNode, ci) => {
        if (Math.random() > 0.5) {
          for (let i = 0; i < 2; i++) {
            particlesRef.current.push(
              new Particle(distNode.x + 50, distNode.y + 20, consNode.x - 40, consNode.y + 15, distNode.color, 0.002 + Math.random() * 0.003)
            );
          }
        }
      });
    });

    const animate = () => {
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 0, width, height);

      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.textAlign = 'center';
      ctx.fillText('SOURCE', sourceX, 30);
      ctx.fillText('DISTRIBUTION', distributionX, 30);
      ctx.fillText('CONSUMPTION', consumptionX, 30);

      ctx.strokeStyle = '#cbd5e1';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(sourceX + 80, 40);
      ctx.lineTo(sourceX + 80, height - 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(distributionX + 60, 40);
      ctx.lineTo(distributionX + 60, height - 20);
      ctx.stroke();
      ctx.setLineDash([]);

      distributionNodes.forEach(node => {
        ctx.strokeStyle = node.color + '40';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sourceX + 60, sourceY);
        const midX = (sourceX + 60 + node.x - 50) / 2;
        ctx.quadraticCurveTo(midX, sourceY, node.x - 50, node.y + 20);
        ctx.stroke();
      });

      distributionNodes.forEach(distNode => {
        consumptionNodes.forEach(consNode => {
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(distNode.x + 50, distNode.y + 20);
          ctx.lineTo(consNode.x - 40, consNode.y + 15);
          ctx.stroke();
          ctx.setLineDash([]);
        });
      });

      const gradient = ctx.createRadialGradient(sourceX, sourceY, 0, sourceX, sourceY, 60);
      gradient.addColorStop(0, '#ef4444');
      gradient.addColorStop(1, '#991b1b');
      
      ctx.beginPath();
      ctx.arc(sourceX, sourceY, 55, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(currentProduct.name, sourceX, sourceY - 10);
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillText(currentProduct.totalUnits.toLocaleString(), sourceX, sourceY + 15);
      ctx.font = '11px Inter, sans-serif';
      ctx.fillStyle = '#fca5a5';
      ctx.fillText('units', sourceX, sourceY + 30);

      distributionNodes.forEach(node => {
        const isHighlight = node.type === 'critical';
        
        ctx.fillStyle = isHighlight ? node.color + '20' : '#ffffff';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = isHighlight ? 3 : 2;
        
        const boxWidth = 100;
        const boxHeight = 50;
        const radius = 8;
        
        ctx.beginPath();
        ctx.roundRect(node.x - boxWidth/2, node.y, boxWidth, boxHeight, radius);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + 18);
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.fillStyle = node.color;
        ctx.fillText(node.units.toString(), node.x, node.y + 38);
      });

      consumptionNodes.forEach(node => {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        
        const boxWidth = 80;
        const boxHeight = 30;
        
        ctx.beginPath();
        ctx.roundRect(node.x - boxWidth/2, node.y, boxWidth, boxHeight, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#475569';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + 12);
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText(`${node.rate}${node.unit}`, node.x, node.y + 24);
      });

      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedCategoryId, currentProduct]);

  const Icon = categoryIcons[selectedCategoryId] || Heart;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Product Journey</h1>
              <p className="text-sm text-slate-500">Real-time visualization of medicine distribution</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg">
            <span className="text-blue-600 font-medium text-sm">{selectedCategory.name}</span>
            <span className="text-blue-500 font-bold">{selectedCategory.itemCount} items</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {medicineCategories.map((cat) => {
            const CatIcon = categoryIcons[cat.id] || Heart;
            const isSelected = selectedCategoryId === cat.id;
            
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <CatIcon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span className="font-medium">{cat.name.replace(' Medicines', '')}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20' : 'bg-slate-100'}`}>
                  {cat.itemCount}
                </span>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <canvas 
            ref={canvasRef} 
            className="w-full"
            style={{ height: '450px' }}
          />
        </div>

        <div className="grid grid-cols-5 gap-4 mt-6">
          {currentProduct.distribution.map((node, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: node.color }}
                />
                <span className="text-slate-600 text-sm">{node.name}</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{node.units}</p>
              <p className="text-slate-400 text-xs">units allocated</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductJourneyScreen;
