import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Target, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const formatCategory = (category) => {
  return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getCategoryProgress = (budget, transactions) => {
  const categoryExpenses = transactions
    .filter(t => t.category === budget.category && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const percentage = budget.monthly_limit > 0 ? (categoryExpenses / budget.monthly_limit) * 100 : 0;
  
  return {
    spent: categoryExpenses,
    percentage: Math.min(percentage, 100),
    isOverBudget: percentage > 100
  };
};

export default function BudgetList({ budgets, transactions, onEdit, onDelete, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="text-center py-20 glass-card rounded-2xl">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Budgets Set for This Month</h3>
        <p className="text-gray-600">Click "Add Budget" to start planning your spending.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const progress = getCategoryProgress(budget, transactions);
        return (
          <div key={budget.id} className="p-4 glass-card rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{formatCategory(budget.category)}</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(budget)}><Edit className="w-4 h-4 text-gray-500" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(budget.id)}><Trash2 className="w-4 h-4 text-gray-500" /></Button>
              </div>
            </div>
            <Progress 
              value={progress.percentage} 
              className={`h-3 mb-2 ${
                progress.isOverBudget ? '[&>div]:bg-red-500' : '[&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500'
              }`}
            />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-medium">
                ${progress.spent.toFixed(2)} spent
              </span>
              <span className="text-gray-500">
                ${(budget.monthly_limit - progress.spent).toFixed(2)} remaining
              </span>
            </div>
            {progress.isOverBudget && (
              <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                You're over budget by ${(progress.spent - budget.monthly_limit).toFixed(2)}!
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}