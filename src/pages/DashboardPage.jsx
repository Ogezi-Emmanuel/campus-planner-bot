import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { getUsdToXofRate, toCFA } from '../lib/currency';

const DashboardPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [studyItems, setStudyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [usdToXofRate, setUsdToXofRate] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
      setError('User not authenticated');
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        const rate = await getUsdToXofRate();
        setUsdToXofRate(rate);
      } catch (_) {}
    })();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      if (!user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      // Fetch expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5); // Limit to 5 recent expenses

      if (expensesError) throw expensesError;
      setExpenses(expensesData);

      // Fetch study items
      const { data: studyItemsData, error: studyItemsError } = await supabase
        .from('study_items')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true })
        .limit(5); // Limit to 5 upcoming study items

      if (studyItemsError) throw studyItemsError;
      setStudyItems(studyItemsData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-8 text-lg">Loading dashboard data...</div>;
  if (error) return <div className="text-center mt-8 text-lg text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-extrabold text-color-primary mb-8 text-center">Your Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="card">
          <h2 className="text-2xl font-semibold text-color-text mb-5">Recent Expenses</h2>
          {expenses.length === 0 ? (
            <p className="text-color-text-light">No recent expenses. Add some in the Expense Tracker!</p>
          ) : (
            <ul className="space-y-4">
              {expenses.map((expense) => (
                <li key={expense.id} className="card flex justify-between items-center">
                  <div>
                    <p className="font-medium text-lg text-color-text">{expense.item_name || 'No name'}</p>
                    <p className="text-sm text-color-text-light">{expense.category} - {new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                  <p className="font-bold text-color-primary text-xl">{`CFA ${Number(expense.amount).toFixed(2)}`}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold text-color-text mb-5">Upcoming Study Items</h2>
          {studyItems.length === 0 ? (
            <p className="text-color-text-light">No upcoming study items. Plan some in the Study Planner!</p>
          ) : (
            <ul className="space-y-4">
              {studyItems.map((item) => (
                <li key={item.id} className={`card flex justify-between items-center ${item.status === 'completed' ? 'line-through text-color-text-light' : ''}`}>
                  <div>
                    <p className="font-medium text-lg text-color-text">{item.title}</p>
                    <p className="text-sm text-color-text-light">{item.subject} - Due: {new Date(item.dueDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-color-primary text-white'}`}>
                    {item.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;