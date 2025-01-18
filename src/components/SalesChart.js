const salesData = [
  { day: "Lun", sales: 650 },
  { day: "Mar", sales: 590 },
  { day: "Mié", sales: 800 },
  { day: "Jue", sales: 810 },
  { day: "Vie", sales: 1200 },
  { day: "Sáb", sales: 1500 },
  { day: "Dom", sales: 1300 },
]

export default function SalesChart() {
  const maxSales = Math.max(...salesData.map(d => d.sales))

  return (
    <div className="w-full h-64 flex items-end justify-between space-x-4">
      {salesData.map((data, index) => (
        <div key={index} className="flex flex-col items-center group">
          <div 
            className="w-10 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-t-xl shadow-md transition-all duration-300 ease-in-out transform group-hover:scale-105"
            style={{ height: `${(data.sales / maxSales) * 100}%` }}
          ></div>
          <span className="text-xs mt-2 text-gray-600">{data.day}</span>
          <span className="text-xs font-bold text-gray-800">{`$${data.sales}`}</span>
        </div>
      ))}
    </div>
  );
  
}