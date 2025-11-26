import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getUsdToXofRate, toCFA } from '../lib/currency';

const ExpenseTrackerPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');
  const [usdToXofRate, setUsdToXofRate] = useState(null);

  // Weekly allowance state
  const [weeklyAllowance, setWeeklyAllowance] = useState(0);
  const [allowanceInput, setAllowanceInput] = useState('');
  const [allowanceLoading, setAllowanceLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [allowanceSupported, setAllowanceSupported] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const rate = await getUsdToXofRate();
        setUsdToXofRate(rate);
      } catch (_) {
        // Leave rate as null to render placeholder
      }
    })();
  }, []);

  const fetchInitialData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }
      setUserId(user.id);

      // Fetch expenses for current user
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (expensesError) throw expensesError;
      setExpenses(expensesData || []);

      // Fetch weekly allowance from profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('weekly_allowance')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        const msg = (profileError.message || '').toLowerCase();
        if (msg.includes('column') && msg.includes('weekly_allowance')) {
          setAllowanceSupported(false);
        } else if (msg.includes('relation') && msg.includes('profiles')) {
          setAllowanceSupported(false);
        } else {
          throw profileError;
        }
        // Fallback to localStorage when DB column/table not available
        const key = `weekly_allowance:${user.id}`;
        const stored = localStorage.getItem(key);
        const allowanceValue = stored != null ? Number(stored) : 0;
        setWeeklyAllowance(allowanceValue);
        setAllowanceInput(Number(allowanceValue).toFixed(2));
      } else {
        const allowanceValue = profile?.weekly_allowance ?? 0;
        const allowanceNum = Number(allowanceValue);
        setWeeklyAllowance(allowanceNum);
        setAllowanceInput(allowanceNum.toFixed(2));
      }
    } catch (err) {
      console.error('Error loading data:', err.message);
      setError(err.message);
    } finally {
      setAllowanceLoading(false);
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }
  
      const parsedAmount = parseFloat(amount);
      if (Number.isNaN(parsedAmount)) {
        setError('Please enter a valid amount');
        return;
      }
  
      const { data, error } = await supabase
        .from('expenses')
        .insert([
          {
            item_name: itemName,
            amount: parsedAmount,
            user_id: user.id,
            date: new Date().toISOString().split('T')[0],
          },
        ])
        .select();
      if (error) throw error;

      const inserted = data && data[0];
      setExpenses([...(expenses || []), inserted]);
      setItemName('');
      setAmount('');
      setError(null);

      // Deduct from allowance and persist balance (entered amount is CFA)
      const newBalance = Math.round((Number(weeklyAllowance) - parsedAmount) * 100) / 100;
      if (!allowanceSupported) {
        const key = `weekly_allowance:${user.id}`;
        localStorage.setItem(key, String(newBalance));
        setWeeklyAllowance(newBalance);
        setAllowanceInput(newBalance.toFixed(2));
      } else {
        const { data: updateData, error: updateError } = await supabase
          .from('profiles')
          .update({ weekly_allowance: newBalance })
          .eq('id', user.id)
          .select();
        if (updateError) throw updateError;
        if (!updateData || updateData.length === 0) {
          const username =
            (user.user_metadata && (user.user_metadata.username || user.user_metadata.full_name)) ||
            user.email ||
            `user_${String(user.id).slice(0, 8)}`;
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({ id: user.id, username, weekly_allowance: newBalance });
          if (insertError) throw insertError;
        }
        setWeeklyAllowance(newBalance);
        setAllowanceInput(newBalance.toFixed(2));
      }
     } catch (err) {
       console.error('Error adding expense:', err.message);
       setError(err.message);
     }
   };

  const saveAllowance = async (e) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }
  
      const value = parseFloat(allowanceInput);
      if (Number.isNaN(value) || value < 0) {
        setError('Please enter a valid allowance amount');
        return;
      }
  
      const rounded = Math.round(value * 100) / 100;
  
      // If allowance is not supported in DB, persist locally
      if (!allowanceSupported) {
        const key = `weekly_allowance:${user.id}`;
        localStorage.setItem(key, String(rounded));
        setWeeklyAllowance(rounded);
        setAllowanceInput(rounded.toFixed(2));
        setError(null);
        return;
      }
   
      // Try UPDATE first; if no row updated, INSERT with a safe username fallback to satisfy NOT NULL
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ weekly_allowance: rounded })
        .eq('id', user.id)
        .select();
 
      if (updateError) throw updateError;
 
      if (!updateData || updateData.length === 0) {
        const username =
          (user.user_metadata && (user.user_metadata.username || user.user_metadata.full_name)) ||
          user.email ||
          `user_${String(user.id).slice(0, 8)}`;
        const { data: insertData, error: insertError } = await supabase
          .from('profiles')
          .insert({ id: user.id, username, weekly_allowance: rounded })
          .select();
        if (insertError) throw insertError;
      }
 
      setWeeklyAllowance(rounded);
      setAllowanceInput(rounded.toFixed(2));
      setError(null);
     } catch (err) {
       console.error('Error saving allowance:', err.message);
       setError(err.message);
     }
   };

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel('expenses-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'expenses', filter: `user_id=eq.${userId}` }, (payload) => {
        setExpenses((prev) => {
          const exists = prev.some((e) => e.id === payload.new.id);
          return exists ? prev : [payload.new, ...prev];
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'expenses', filter: `user_id=eq.${userId}` }, (payload) => {
        setExpenses((prev) => prev.map((e) => (e.id === payload.new.id ? payload.new : e)));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'expenses', filter: `user_id=eq.${userId}` }, (payload) => {
        setExpenses((prev) => prev.filter((e) => e.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <div className="min-h-screen bg-background text-text flex flex-col items-center py-10 px-4 font-roboto">
      <h1 className="text-4xl font-extrabold text-primary mb-8">Expense Tracker</h1>

      {/* Weekly Allowance Section */}
      <section className="card w-full max-w-md mb-8 space-y-4">
        <h2 className="text-2xl font-bold text-text">Weekly Allowance</h2>
        {allowanceLoading ? (
          <p className="text-lightText">Loading allowance...</p>
        ) : !allowanceSupported ? (
          <div className="space-y-2">
            <p className="text-lightText">Weekly allowance is not configured in your database. Please add the column to the <span className="font-semibold">profiles</span> table to enable this feature.</p>
            <p className="text-sm text-lightText">We will save your allowance locally on this device in the meantime.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-text">Current allowance: <span className="font-semibold text-primary">CFA {weeklyAllowance.toFixed(2)}</span></p>
            <form onSubmit={saveAllowance} className="space-y-3">
              <div>
                <label htmlFor="allowance" className="block text-text-light text-sm font-medium mb-1">Set Allowance (CFA)</label>
                <input
                  type="number"
                  id="allowance"
                  className="input mt-1"
                  value={allowanceInput}
                  onChange={(e) => setAllowanceInput(e.target.value)}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">Save Allowance</button>
            </form>
          </div>
        )}
      </section>

      {/* Add Expense Form */}
      <form onSubmit={addExpense} className="card w-full max-w-md mb-8 space-y-6">
        <div>
          <label htmlFor="itemName" className="block text-text-light text-sm font-medium mb-1">Item Name</label>
          <input
            type="text"
            id="itemName"
            className="input mt-1"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-text-light text-sm font-medium mb-1">Amount (CFA)</label>
          <input
            type="number"
            id="amount"
            className="input mt-1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            required
          />
        </div>
        <button
          type="submit"
          className="btn-primary w-full"
        >
          Add Expense
        </button>
      </form>

      {/* Expenses List */}
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-text mb-4">Expenses</h2>
        {error && <p className="text-accent mb-2">{error}</p>}
        {expenses.length === 0 ? (
          <p className="text-text-light">No expenses added yet.</p>
        ) : (
          <ul>
            {expenses.map((expense) => (
              <li key={expense.id} className="flex justify-between items-center border-b border-border py-3 last:border-b-0">
                <span className="text-text text-lg">{expense.item_name}</span>
                <span className="text-text-light text-lg">{`CFA ${Number(expense.amount).toFixed(2)}`}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExpenseTrackerPage;