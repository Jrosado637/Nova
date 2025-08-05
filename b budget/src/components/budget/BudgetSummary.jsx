import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PiggyBank, Receipt, Target } from "lucide-react";

export default function BudgetSummary({ budgets, transactions, isLoading }) {
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.monthly_limit, 0);
  const totalSpent = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const remaining = totalBudgeted - totalSpent;

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
            <p className="text-sm text-gray-600">Total Budgeted</p>
            <p className="text-2xl font-bold text-gray-900">${totalBudgeted.toFixed(2)}</p>
          </div>
        </div>
      </Card>
      <Card className="glass-card border-0 shadow-lg p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-xl">
            <Receipt className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
          </div>
        </div>
      </Card>
      <Card className="glass-card border-0 shadow-lg p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <PiggyBank className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Remaining</p>
            <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
              ${remaining.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}