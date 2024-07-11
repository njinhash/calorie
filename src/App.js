import React, { useState } from 'react';
import './CalorieCounter.css';

const CalorieCounter = () => {
  const [budget, setBudget] = useState('');
  const [entries, setEntries] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
    exercise: [],
  });
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [output, setOutput] = useState(null);

  const cleanInputString = (str) => {
    const regex = /[+-\s]/g;
    return str.replace(regex, '');
  };

  const isInvalidInput = (str) => {
    const regex = /\d+e\d+/i;
    return str.match(regex);
  };

  const addEntry = () => {
    setEntries(prevEntries => ({
      ...prevEntries,
      [selectedMeal]: [
        ...prevEntries[selectedMeal],
        { name: '', calories: '' }
      ]
    }));
  };

  const handleEntryChange = (meal, index, field, value) => {
    setEntries(prevEntries => ({
      ...prevEntries,
      [meal]: prevEntries[meal].map((entry, i) => 
        i === index ? { ...entry, [field]: value } : entry
      )
    }));
  };

  const getCaloriesFromInputs = (inputs) => {
    let calories = 0;
    for (const input of inputs) {
      const currVal = cleanInputString(input.calories);
      const invalidInputMatch = isInvalidInput(currVal);
      if (invalidInputMatch) {
        alert(`Invalid Input: ${invalidInputMatch[0]}`);
        return null;
      }
      calories += Number(currVal);
    }
    return calories;
  };

  const calculateCalories = (e) => {
    e.preventDefault();
    
    const breakfastCalories = getCaloriesFromInputs(entries.breakfast);
    const lunchCalories = getCaloriesFromInputs(entries.lunch);
    const dinnerCalories = getCaloriesFromInputs(entries.dinner);
    const snacksCalories = getCaloriesFromInputs(entries.snacks);
    const exerciseCalories = getCaloriesFromInputs(entries.exercise);
    const budgetCalories = Number(cleanInputString(budget));

    if (breakfastCalories === null || lunchCalories === null || dinnerCalories === null || 
        snacksCalories === null || exerciseCalories === null || isNaN(budgetCalories)) {
      return;
    }

    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
    const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';

    setOutput({
      remainingCalories,
      surplusOrDeficit,
      budgetCalories,
      consumedCalories,
      exerciseCalories
    });
  };

  const clearForm = () => {
    setBudget('');
    setEntries({
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
      exercise: [],
    });
    setOutput(null);
  };

  const renderEntries = (meal) => (
    <fieldset id={meal}>
      <legend>{meal.charAt(0).toUpperCase() + meal.slice(1)}</legend>
      <div className="input-container">
        {entries[meal].map((entry, index) => (
          <div key={index}>
            <label htmlFor={`${meal}-${index + 1}-name`}>Entry {index + 1} Name</label>
            <input
              type="text"
              id={`${meal}-${index + 1}-name`}
              placeholder="Name"
              value={entry.name}
              onChange={(e) => handleEntryChange(meal, index, 'name', e.target.value)}
            />
            <label htmlFor={`${meal}-${index + 1}-calories`}>Entry {index + 1} Calories</label>
            <input
              type="number"
              min="0"
              id={`${meal}-${index + 1}-calories`}
              placeholder="Calories"
              value={entry.calories}
              onChange={(e) => handleEntryChange(meal, index, 'calories', e.target.value)}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );

  return (
    <main className="calorie-counter">
      <h1>Calorie Counter</h1>
      <div className="container">
        <form id="calorie-counter" onSubmit={calculateCalories} className="calorie-form">
          <label htmlFor="budget">Budget</label>
          <input
            type="number"
            min="0"
            id="budget"
            placeholder="Daily calorie budget"
            required
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          {renderEntries('breakfast')}
          {renderEntries('lunch')}
          {renderEntries('dinner')}
          {renderEntries('snacks')}
          {renderEntries('exercise')}
          <div className="controls">
            <span>
              <label htmlFor="entry-dropdown">Add food or exercise:</label>
              <select 
                id="entry-dropdown" 
                name="options" 
                value={selectedMeal}
                onChange={(e) => setSelectedMeal(e.target.value)}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snacks">Snacks</option>
                <option value="exercise">Exercise</option>
              </select>
              <button type="button" onClick={addEntry}>Add Entry</button>
            </span>
          </div>
          <div>
            <button type="submit">Calculate Remaining Calories</button>
            <button type="button" onClick={clearForm}>Clear</button>
          </div>
        </form>
        {output && (
          <div id="output" className="output">
            <span className={output.surplusOrDeficit.toLowerCase()}>
              {Math.abs(output.remainingCalories)} Calorie {output.surplusOrDeficit}
            </span>
            <hr />
            <p>{output.budgetCalories} Calories Budgeted</p>
            <p>{output.consumedCalories} Calories Consumed</p>
            <p>{output.exerciseCalories} Calories Burned</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default CalorieCounter;