interface CrowdBarProps {
  malePercentage: number;
  femalePercentage: number;
  totalPeople: number;
}

export function CrowdBar({ malePercentage, femalePercentage, totalPeople }: CrowdBarProps) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-gray-300 mb-1">
        <span>Gender Ratio</span>
        <span>{malePercentage}% M • {femalePercentage}% F</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-400 to-pink-400 h-2 rounded-full transition-all duration-500" 
          style={{ width: `${malePercentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{totalPeople} people checked in</span>
        <span>Updated now</span>
      </div>
    </div>
  );
}
