// OTIF Color Coding Utility
// Based on user specifications:
// Below 60% - Red
// 60% - 85% - Orange  
// 85% - 95% - Yellow
// 95% - 100% - Green

export const getOtifColor = (percentage) => {
  const value = parseFloat(percentage);
  
  if (value < 60) {
    return {
      bg: 'bg-red-500',
      text: 'text-red-500',
      bgLight: 'bg-red-100',
      textLight: 'text-red-700',
      border: 'border-red-500',
      hex: '#ef4444'
    };
  } else if (value >= 60 && value < 85) {
    return {
      bg: 'bg-orange-500',
      text: 'text-orange-500',
      bgLight: 'bg-orange-100',
      textLight: 'text-orange-700',
      border: 'border-orange-500',
      hex: '#f97316'
    };
  } else if (value >= 85 && value < 95) {
    return {
      bg: 'bg-yellow-500',
      text: 'text-yellow-500',
      bgLight: 'bg-yellow-100',
      textLight: 'text-yellow-700',
      border: 'border-yellow-500',
      hex: '#eab308'
    };
  } else {
    return {
      bg: 'bg-green-500',
      text: 'text-green-500',
      bgLight: 'bg-green-100',
      textLight: 'text-green-700',
      border: 'border-green-500',
      hex: '#22c55e'
    };
  }
};

export const getOtifColorClass = (percentage) => {
  const value = parseFloat(percentage);
  
  if (value < 60) return 'text-red-500';
  if (value >= 60 && value < 85) return 'text-orange-500';
  if (value >= 85 && value < 95) return 'text-yellow-500';
  return 'text-green-500';
};

export const getOtifBgClass = (percentage) => {
  const value = parseFloat(percentage);
  
  if (value < 60) return 'bg-red-500';
  if (value >= 60 && value < 85) return 'bg-orange-500';
  if (value >= 85 && value < 95) return 'bg-yellow-500';
  return 'bg-green-500';
};

export default { getOtifColor, getOtifColorClass, getOtifBgClass };
