import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const ProductJourneyModal = ({ isOpen, onClose, selectedItem }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  const getProductData = () => {
    if (!selectedItem) return null;

    const medicineName = selectedItem.sku || 'Medicine';
    const totalUnits = parseInt(selectedItem.forecast?.split(' ')[0]) || 500;

    const icuPct = 0.12, emergencyPct = 0.22, generalPct = 0.28, otPct = 0.20, pharmacyPct = 0.18;

    return {
      name: medicineName.replace('Tab. ', '').replace('Inj. ', ''),
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

  useEffect(() => {
    if (!isOpen || !currentProduct) return;

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
  }, [isOpen, currentProduct]);

  if (!isOpen || !currentProduct) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="absolute inset-4 bg-white rounded-xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Product Journey</h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedItem?.sku} - Flow Analysis
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Animated Canvas */}
        <div className="flex-1 overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
          />
        </div>

        {/* Distribution Summary */}
        <div className="p-6 border-t border-gray-200">
          <div className="grid grid-cols-5 gap-4">
            {currentProduct.distribution.map((node, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: node.color }}
                  />
                  <span className="text-gray-600 text-xs">{node.name}</span>
                </div>
                <p className="text-lg font-bold text-gray-800">{node.units}</p>
                <p className="text-gray-400 text-xs">units allocated</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductJourneyModal;
