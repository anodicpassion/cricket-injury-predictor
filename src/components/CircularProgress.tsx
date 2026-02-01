import { useEffect, useState } from "react";

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress = ({ percentage, size = 200, strokeWidth = 12 }: CircularProgressProps) => {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayPercentage / 100) * circumference;

  const getColor = () => {
    if (percentage < 50) return "hsl(142, 70%, 45%)";
    if (percentage <= 80) return "hsl(38, 92%, 50%)";
    return "hsl(0, 72%, 51%)";
  };

  const getTextColor = () => {
    if (percentage < 50) return "text-success";
    if (percentage <= 80) return "text-warning";
    return "text-danger";
  };

  const getRiskLabel = () => {
    if (percentage < 50) return "Low Risk";
    if (percentage <= 80) return "Medium Risk";
    return "High Risk";
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (displayPercentage < percentage) {
        setDisplayPercentage(prev => Math.min(prev + 1, percentage));
      }
    }, 20);
    return () => clearTimeout(timer);
  }, [displayPercentage, percentage]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-100 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold font-display ${getTextColor()}`}>
            {displayPercentage}%
          </span>
        </div>
      </div>
      <div className={`text-xl font-semibold ${getTextColor()}`}>
        {getRiskLabel()}
      </div>
    </div>
  );
};

export default CircularProgress;
