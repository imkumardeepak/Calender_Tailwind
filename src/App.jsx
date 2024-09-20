// src/Calendar.jsx
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import dayjs from 'dayjs'; // Using dayjs for date manipulation

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : {};
  });
  const [editingTask, setEditingTask] = useState({ date: null, index: null });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const currentMonth = dayjs(); // Automatically get the current month
  const daysInMonth = currentMonth.daysInMonth(); // Number of days in the month
  const startDay = currentMonth.startOf('month').day(); // Day of the week the month starts on
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateClick = (day) => {
    const date = currentMonth.date(day).format('YYYY-MM-DD');
    setSelectedDate(date);
    setTaskInput('');
    setEditingTask({ date: null, index: null });
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      if (editingTask.date === selectedDate && editingTask.index !== null) {
        newTasks[selectedDate][editingTask.index] = taskInput.trim();
      } else {
        if (!newTasks[selectedDate]) {
          newTasks[selectedDate] = [];
        }
        newTasks[selectedDate].push(taskInput.trim());
      }
      return newTasks;
    });

    setTaskInput('');
    setEditingTask({ date: null, index: null });
  };

  const handleTaskEdit = (task, index) => {
    setTaskInput(task);
    setEditingTask({ date: selectedDate, index });
  };

  const handleTaskDelete = (index) => {
    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      newTasks[selectedDate].splice(index, 1);
      if (newTasks[selectedDate].length === 0) {
        delete newTasks[selectedDate];
      }
      return newTasks;
    });
    setTaskInput('');
    setEditingTask({ date: null, index: null });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl drop-shadow-xl   max-w-md mx-auto my-5 ">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        {currentMonth.format('MMMM YYYY')}
      </h2>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: daysInMonth + startDay }).map((_, index) => {
          const day = index - startDay + 1;
          const date = currentMonth.date(day).format('YYYY-MM-DD');

          if (index < startDay) {
            return <div key={index}></div>; // Empty cells for days from previous month
          }

          return (
            <div
              key={index}
              className={`text-center p-2 rounded-lg border border-gray-200 cursor-pointer ${
                tasks[date] ? 'bg-yellow-100' : ''
              }`}
              onClick={() => handleDateClick(day)}
            >
              {day > 0 && day <= daysInMonth ? day : ''}
            </div>
          );
        })}
      </div>
      {selectedDate && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Tasks for {selectedDate}</h3>
          <form onSubmit={handleTaskSubmit} className="mb-4">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none  focus:border-blue-500 mb-2"
              placeholder="Enter a task"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              {editingTask.date ? 'Update Task' : 'Add Task'}
            </button>
          </form>
          <ul className="list-disc list-inside">
            {tasks[selectedDate] ? (
              tasks[selectedDate].map((task, idx) => (
                <li key={idx} className="flex justify-between items-center mb-2">
                  <span>{task}</span>
                  <div>
                    <button
                      className="text-blue-500 mr-2"
                      onClick={() => handleTaskEdit(task, idx)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleTaskDelete(idx)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li>No tasks</li>
            )}
          </ul>
        </div>
      )}
     
    </div>
  );
}

export default Calendar;
