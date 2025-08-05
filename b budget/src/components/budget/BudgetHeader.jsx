import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format } from "date-fns";

export default function BudgetHeader({ selectedMonth, onMonthChange, onAddBudget }) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Monthly Budget</h1>
        <p className="text-gray-600">Set and track your spending limits.</p>
      </div>
      <div className="flex items-center gap-2 w-full lg:w-auto">
        <Button variant="outline" size="icon" onClick={() => onMonthChange('prev')}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="font-semibold text-lg text-gray-800 w-32 text-center">
          {format(selectedMonth, 'MMMM yyyy')}
        </span>
        <Button variant="outline" size="icon" onClick={() => onMonthChange('next')}>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button onClick={onAddBudget} className="ml-4 flex-1 lg:flex-none bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Budget
        </Button>
      </div>
    </div>
  );
}