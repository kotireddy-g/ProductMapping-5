import React, { useEffect, useState } from 'react';

function BouncingBubbles({ product, onBubbleClick }) {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    // Generate bubbles for different time periods
    const timeframes = ['Hourly', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
    const newBubbles = timeframes.map((timeframe, index) => {
      const status = Math.random() > 0.5 ? (Math.random() > 0.5 ? 'over' : 'under') : 'normal';
      const size = 12 + Math.random() * 6; // 12-18 (uniform, small but visible)

      return {
        id: index,
        timeframe,
        status,
        size,
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      };
    });

    setBubbles(newBubbles);

    // Animation loop
    const interval = setInterval(() => {
      setBubbles((prevBubbles) =>
        prevBubbles.map((bubble) => {
          let newX = bubble.x + bubble.vx;
          let newY = bubble.y + bubble.vy;
          let newVx = bubble.vx;
          let newVy = bubble.vy;

          // Bounce off walls
          if (newX - bubble.size / 2 < 0 || newX + bubble.size / 2 > 100) {
            newVx = -newVx;
            newX = Math.max(bubble.size / 2, Math.min(100 - bubble.size / 2, newX));
          }
          if (newY - bubble.size / 2 < 0 || newY + bubble.size / 2 > 100) {
            newVy = -newVy;
            newY = Math.max(bubble.size / 2, Math.min(100 - bubble.size / 2, newY));
          }

          return {
            ...bubble,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [product]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'over':
        return '#ef4444'; // red
      case 'under':
        return '#eab308'; // yellow
      default:
        return '#22c55e'; // green
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'over':
        return 'Over';
      case 'under':
        return 'Under';
      default:
        return 'Normal';
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden border border-slate-200" style={{ height: '400px' }}>
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {bubbles.map((bubble) => (
          <g
            key={bubble.id}
            onClick={() => onBubbleClick()}
            style={{ cursor: 'pointer' }}
          >
            {/* Bubble shadow */}
            <circle
              cx={bubble.x}
              cy={bubble.y + 1}
              r={bubble.size / 2}
              fill="rgba(0, 0, 0, 0.1)"
              filter="blur(1px)"
            />
            {/* Main bubble */}
            <circle
              cx={bubble.x}
              cy={bubble.y}
              r={bubble.size / 2}
              fill={getStatusColor(bubble.status)}
              opacity="0.8"
              className="hover:opacity-100 transition-opacity"
            />
            {/* Bubble highlight */}
            <circle
              cx={bubble.x - bubble.size / 6}
              cy={bubble.y - bubble.size / 6}
              r={bubble.size / 8}
              fill="white"
              opacity="0.3"
            />
            {/* Bubble text */}
            <text
              x={bubble.x}
              y={bubble.y}
              textAnchor="middle"
              dy="0.3em"
              fontSize={bubble.size / 4}
              fontWeight="bold"
              fill="white"
              pointerEvents="none"
            >
              {bubble.timeframe.charAt(0)}
            </text>
            {/* Status label below */}
            <text
              x={bubble.x}
              y={bubble.y + bubble.size / 2 + 3}
              textAnchor="middle"
              fontSize="2"
              fill={getStatusColor(bubble.status)}
              pointerEvents="none"
              fontWeight="bold"
            >
              {getStatusLabel(bubble.status)}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-4 bg-white bg-opacity-90 rounded-lg p-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Under Consumed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Over Consumed</span>
        </div>
      </div>
    </div>
  );
}

export default BouncingBubbles;
