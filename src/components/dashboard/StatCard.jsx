const StatCard = ({ title, value }) => {
    return (
      <div className="flex flex-col justify-center items-center bg-white px-6 py-4 rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    );
  };
  
  export default StatCard;