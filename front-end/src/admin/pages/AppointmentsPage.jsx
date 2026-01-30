import React, { useEffect, useState } from 'react';
import { getAppointments } from '../../api/appointments';

export default function AppointmentsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getAppointments()
      .then((data) => setItems(data || []))
      .catch((err) =>
        setError(err?.response?.data?.error || 'Failed to load appointments')
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-gray-500 border-b">
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Phone</th>
                <th className="py-3 pr-4">Service</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Time</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a._id} className="border-b text-sm">
                  <td className="py-3 pr-4 font-medium text-gray-900">{a.name}</td>
                  <td className="py-3 pr-4">{a.email}</td>
                  <td className="py-3 pr-4">{a.phone}</td>
                  <td className="py-3 pr-4">{a.service}</td>
                  <td className="py-3 pr-4">
                    {a.date ? new Date(a.date).toLocaleDateString() : ''}
                  </td>
                  <td className="py-3 pr-4">{a.time}</td>
                  <td className="py-3 pr-4">
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="py-6 text-gray-600" colSpan={7}>
                    No appointments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

