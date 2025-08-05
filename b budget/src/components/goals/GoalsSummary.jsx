import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PiggyBank, Target, Trophy } from "lucide-react";

export default function GoalsSummary({ goals, isLoading }) {
  const activeGoals = goals.filter(g => !g.is_completed);
  const completedGoals = goals.filter(g => g.is_completed);
  const totalSaved = goals.reduce((sum, g) => sum + (g.current_amount || 0), 0);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="glass-card border-0 shadow-lg p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Goals</p>
            <p className="text-2xl font-bold text-gray-900">{activeGoals.length}</p>
          </div>
        </div>
      </Card>
      <Card className="glass-card border-0 shadow-lg p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <Trophy className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Completed Goals</p>
            <p className="text-2xl font-bold text-gray-900">{completedGoals.length}</p>
          </div>
        </div>
      </Card>
      <Card className="glass-card border-0 shadow-lg p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-xl">
            <PiggyBank className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Saved</p>
            <p className="text-2xl font-bold text-gray-900">${totalSaved.toFixed(2)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}