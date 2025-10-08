interface StatCardProps {
  icon: React.ReactNode;
  label?: string;
  value: string;
  className?: string;
}

export const StatCard = ({
  icon,
  label,
  value,
  className = "",
}: StatCardProps) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg ${className}`}>
    <div className="p-2 rounded-md bg-white dark:bg-gray-800/50 shadow-xs">
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
        {value}
      </p>
    </div>
  </div>
);
