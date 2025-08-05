
import React, { useState, useEffect } from "react";
import { Goal } from "@/api/entities";
import { Plus, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

import GoalList from "../components/goals/GoalList";
import GoalForm from "../components/goals/GoalForm";
import GoalsSummary from "../components/goals/GoalsSummary";
import AddContributionModal from "../components/goals/AddContributionModal";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [contributingGoal, setContributingGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setIsLoading(true);
    const data = await Goal.list('-target_date');
    setGoals(data);
    setIsLoading(false);
  };

  const handleFormSubmit = async (goalData) => {
    if (editingGoal) {
      await Goal.update(editingGoal.id, goalData);
    } else {
      await Goal.create(goalData);
    }
    setShowForm(false);
    setEditingGoal(null);
    loadGoals();
  };
  
  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = async (goalId) => {
    await Goal.delete(goalId);
    loadGoals();
  };

  const handleAddContribution = async (goal, amount) => {
    const newCurrentAmount = (goal.current_amount || 0) + amount;
    const isCompleted = newCurrentAmount >= goal.target_amount;
    
    await Goal.update(goal.id, {
      current_amount: newCurrentAmount,
      is_completed: isCompleted
    });
    
    setContributingGoal(null);
    loadGoals();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Financial Goals</h1>
          <p className="text-gray-600 dark:text-gray-400">Set targets and track your progress to financial success.</p>
        </div>
        <Button 
          onClick={() => { setShowForm(true); setEditingGoal(null); }}
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 w-full lg:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Set New Goal
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <GoalForm
            goal={editingGoal}
            onSubmit={handleFormSubmit}
            onCancel={() => { setShowForm(false); setEditingGoal(null); }}
          />
        </div>
      )}
      
      <GoalsSummary goals={goals} isLoading={isLoading} />
      
      <div className="mt-8">
        <GoalList
          goals={goals}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddContribution={(goal) => setContributingGoal(goal)}
          isLoading={isLoading}
        />
      </div>

      <AddContributionModal
        isOpen={!!contributingGoal}
        onClose={() => setContributingGoal(null)}
        onSubmit={handleAddContribution}
        goal={contributingGoal}
      />
    </div>
  );
}
