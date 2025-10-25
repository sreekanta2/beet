export const Loader = () => {
  return (
    <div className="absolute inset-0 bg-gray-50/95 backdrop-blur-md flex items-center justify-center z-50">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-24 h-24 border-4 border-transparent border-t-blue-500 border-r-blue-300 rounded-full animate-spin"></div>

        {/* Middle ring */}
        <div className="absolute top-2 left-2 w-20 h-20 border-4 border-transparent border-b-indigo-500 border-l-indigo-300 rounded-full animate-spin animation-delay-100"></div>

        {/* Inner ring */}
        <div className="absolute top-4 left-4 w-16 h-16 border-4 border-transparent border-t-purple-500 border-r-purple-300 rounded-full animate-spin animation-delay-200"></div>

        {/* Center logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center">
            <span className="font-bold text-sm">ET</span>
          </div>
        </div>
      </div>
    </div>
  );
};
