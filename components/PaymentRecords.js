export default function PaymentHistory({ payments }) {
  if (payments.length === 0) return <h3>No payments yet...</h3>;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Recent Payments</h3>
      <div className="space-y-3">
        {payments?.map((item, index) => (
          <div 
            key={index} 
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex justify-between items-center"
          >
            <div>
              <div className="font-medium text-gray-900">{item.email}</div>
              <div className="text-xs text-gray-500">{item.date}</div>
            </div>
            <div className="font-bold text-green-600">
              ${Number(item.amount).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}