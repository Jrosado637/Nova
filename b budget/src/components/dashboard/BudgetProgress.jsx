import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { format, startOfMonth } from "date-fns";

export default function BudgetProgress({ budgets, transactions }) {
  const currentMonth = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const currentBudgets = budgets.filter(b => b.month === currentMonth);

  const getBudgetProgress = (budget) => {
    const categoryExpenses = transactions
      .filter(t => t.category === budget.category && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const percentage = (categoryExpenses / budget.monthly_limit) * 100;
    return {
      spent: categoryExpenses,
      percentage: Math.min(percentage, 100),
      isOverBudget: percentage > 100
    };
  };

  const formatCategory = (category) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-gray-900">Budget Progress</CardTitle>
        <Link to={createPageUrl("Budget")}>
          <Button variant="outline" size="sm">Manage Budget</Button>
        </Link>
      </CardHeader>
      <CardContent>
        {currentBudgets.length > 0 ? (
          <div className="space-y-6">
            {currentBudgets.map((budget) => {
              const progress = getBudgetProgress(budget);
              return (
                <div key={budget.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      {formatCategory(budget.category)}
                    </h4>
                    <div className="flex items-center gap-2">
                      {progress.isOverBudget && (
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      )}
                      <span className="text-sm text-gray-600">
                        ${progress.spent.toFixed(2)} / ${budget.monthly_limit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={progress.percentage} 
                    className={`h-2 ${
                      progress.isOverBudget ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'
                    }`}
                  />
                  <div className="flex justify-between text-sm">
                    <span className={`${
                      progress.isOverBudget ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {progress.percentage.toFixed(1)}% used
                    </span>
                    <span className="text-gray-500">
                      ${(budget.monthly_limit - progress.spent).toFixed(2)} remaining
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-2">No budgets set</p>
            <p className="text-sm text-gray-500 mb-4">Create budgets to track your spending</p>
            <Link to={createPageUrl("Budget")}>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Set Up Budget
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}