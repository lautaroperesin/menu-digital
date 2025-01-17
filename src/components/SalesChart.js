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
    <div className="w-full h-64 flex items-end justify-between">
      {salesData.map((data, index) => (
        <div key={index} className="flex flex-col items-center">
          <div 
            className="w-8 bg-yellow-500 rounded-t"
            style={{ height: `${(data.sales / maxSales) * 100}%` }}
          ></div>
          <span className="text-xs mt-2">{data.day}</span>
          <span className="text-xs font-bold">${data.sales}</span>
        </div>
      ))}
    </div>
  )
}