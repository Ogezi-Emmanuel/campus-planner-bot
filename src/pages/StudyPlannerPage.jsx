import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const StudyPlannerPage = () => {
  const [studyItems, setStudyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStudyItem, setNewStudyItem] = useState({
    title: '',
    subject: '',
    dueDate: '',
    status: 'pending',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchStudyItems();
  }, []);

  const fetchStudyItems = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('study_items')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true }); // Ensure using correct column name

      if (error) throw error;
      setStudyItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudyItem({ ...newStudyItem, [name]: value });
    setFormErrors({ ...formErrors, [name]: null }); // Clear error when input changes
  };

  const validateForm = () => {
    const errors = {};
    if (!newStudyItem.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!newStudyItem.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    if (!newStudyItem.dueDate) {
      errors.dueDate = 'Due Date is required';
    } else if (new Date(newStudyItem.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))) {
      errors.dueDate = 'Due Date cannot be in the past';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddStudyItem = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      const payload = {
        title: newStudyItem.title,
        subject: newStudyItem.subject,
        due_date: newStudyItem.dueDate, // Map to correct column name
        status: newStudyItem.status,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('study_items')
        .insert([payload])
        .select();

      if (error) throw error;
      setStudyItems([...studyItems, data[0]]);
      setNewStudyItem({ title: '', subject: '', dueDate: '', status: 'pending' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkComplete = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      const { error } = await supabase
        .from('study_items')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setStudyItems(studyItems.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-background text-text font-roboto">
      <h1 className="text-4xl font-extrabold text-primary mb-8 text-center">Study Planner</h1>
      <div className="grid grid-cols-1 gap-8">
        <div className="card animate-pulse">
          <div className="h-6 bg-lightText rounded w-3/4 mb-5"></div>
          <div className="space-y-4">
            <div className="h-10 bg-lightText rounded"></div>
            <div className="h-10 bg-lightText rounded"></div>
            <div className="h-10 bg-lightText rounded"></div>
            <div className="h-12 bg-primary rounded"></div>
          </div>
        </div>
        <div className="card animate-pulse">
          <div className="h-6 bg-lightText rounded w-3/4 mb-5"></div>
          <div className="space-y-4">
            <div className="h-16 bg-lightText rounded"></div>
            <div className="h-16 bg-lightText rounded"></div>
            <div className="h-16 bg-lightText rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
  if (error) return <div className="text-center mt-8 text-accent bg-background min-h-screen flex items-center justify-center font-roboto p-4 card">Error: {error}</div>;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-background text-text font-roboto">
      <h1 className="text-4xl font-extrabold text-primary mb-8 text-center">Study Planner</h1>

      <section className="card mb-8">
        <h2 className="text-2xl font-semibold text-text mb-6">Add New Study Item</h2>
        <form onSubmit={handleAddStudyItem} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-lightText mb-1">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newStudyItem.title}
              onChange={handleInputChange}
              className={`input mt-1 ${formErrors.title ? 'border-red-500' : ''}`}
              placeholder="e.g., Prepare for Midterm"
              required
            />
            {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-lightText mb-1">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={newStudyItem.subject}
              onChange={handleInputChange}
              className={`input mt-1 ${formErrors.subject ? 'border-red-500' : ''}`}
              placeholder="e.g., Data Structures"
              required
            />
            {formErrors.subject && <p className="text-red-500 text-xs mt-1">{formErrors.subject}</p>}
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-lightText mb-1">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={newStudyItem.dueDate}
              onChange={handleInputChange}
              className={`input mt-1 ${formErrors.dueDate ? 'border-red-500' : ''}`}
              required
              min={today}
            />
            {formErrors.dueDate && <p className="text-red-500 text-xs mt-1">{formErrors.dueDate}</p>}
          </div>
          <button type="submit" className="btn-primary w-full">Add Study Item</button>
        </form>
      </section>

      <section className="card">
        <h2 className="text-2xl font-semibold text-text mb-6">Your Study Items</h2>
        {studyItems.length === 0 ? (
          <p className="text-lightText">No study items planned yet. Add one above!</p>
        ) : (
          <ul className="space-y-4">
            {studyItems.map((item) => (
              <li key={item.id} className={`card flex flex-col sm:flex-row justify-between items-start sm:items-center ${item.status === 'completed' ? 'opacity-60' : ''}`}>
                <div className="mb-2 sm:mb-0">
                  <p className="font-medium text-lg text-text">{item.title}</p>
                  <p className="text-sm text-lightText">{item.subject} - Due: {new Date(item.due_date || item.dueDate).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleMarkComplete(item.id, item.status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${item.status === 'completed' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-primary hover:bg-primary-dark text-white'}`}
                >
                  {item.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default StudyPlannerPage;