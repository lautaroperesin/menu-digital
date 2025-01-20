export default function SalesChart({ weeklySales, weeklyTotal }) {
  return (
    <div className="space-y-4">
    {weeklySales?.map((day) => (
      <div 
        key={day.date} 
        className="flex items-center justify-between border-b pb-2"
      >
        <div className="flex flex-col">
          <span className="font-medium capitalize">
            {day.dayName}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(day.date).toLocaleDateString()}
          </span>
        </div>
        <div className="text-lg font-semibold">
          ${day.total}
        </div>
      </div>
    ))}
    <div className="flex items-center justify-between pt-4 border-t">
      <span className="font-bold">Total Semanal</span>
      <span className="text-xl font-bold text-green-600">
        ${weeklyTotal}
      </span>
    </div>
  </div>
  );
  
}