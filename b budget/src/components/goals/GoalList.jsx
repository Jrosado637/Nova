import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Trophy } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const GoalItem = ({ goal, onEdit, onDelete, onAddContribution }) => {
  const progress = goal.target_amount > 0 ? ((goal.current_amount || 0) / goal.target_amount) * 100 : 0;
  
  return (
    <div className="p-4 glass-card rounded-xl shadow-md space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{goal.title}</h3>
          <p className="text-sm text-gray-500">{goal.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(goal)}><Edit className="w-4 h-4 text-gray-500" /></Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(goal.id)}><Trash2 className="w-4 h-4 text-gray-500" /></Button>
        </div>
      </div>
      
      <Progress 
        value={progress} 
        className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-pink-500"
      />
      
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-gray-600 font-medium">
            ${(goal.current_amount || 0).toFixed(2)} / ${goal.target_amount.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            Due by {format(new Date(goal.target_date), 'MMM d, yyyy')}
          </p>
        </div>
        <Button size="sm" onClick={() => onAddContribution(goal)}>
          <Plus className="w-4 h-4 mr-2" /> Add Contribution
        </Button>
      </div>
    </div>
  );
};

export default function GoalList({ goals, onEdit, onDelete, onAddContribution, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
      </div>
    );
  }

  const activeGoals = goals.filter(g => !g.is_completed);
  const completedGoals = goals.filter(g => g.is_completed);

  if (goals.length === 0) {
    return (
      <div className="text-center py-20 glass-card rounded-2xl">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Goals Yet</h3>
        <p className="text-gray-600">Click "Set New Goal" to start your financial journey.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeGoals.map((goal) => (
            <GoalItem key={goal.id} goal={goal} onEdit={onEdit} onDelete={onDelete} onAddContribution={onAddContribution} />
          ))}
        </div>
        {activeGoals.length === 0 && <p className="text-gray-500">No active goals. Time to set a new one!</p>}
      </div>

      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Completed Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedGoals.map((goal) => (
              <div key={goal.id} className="p-4 glass-card rounded-xl shadow-md opacity-70">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800 line-through">{goal.title}</h3>
                  <Trophy className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-sm text-gray-500">Achieved on {format(new Date(goal.updated_date), 'MMM d, yyyy')}</p>
                <p className="font-bold text-green-600 mt-2">${goal.target_amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}