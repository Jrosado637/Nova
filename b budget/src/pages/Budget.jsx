
import React, { useState, useEffect } from "react";
import { Budget, Transaction } from "@/api/entities";
import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from "date-fns";

import BudgetHeader from "../components/budget/BudgetHeader";
import BudgetSummary from "../components/budget/BudgetSummary";
import BudgetList from "../components/budget/BudgetList";
import BudgetFormModal from "../components/budget/BudgetFormModal";

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBudgetData();
  }, [selectedMonth]);

  const loadBudgetData = async () => {
    setIsLoading(true);
    const monthStart = format(selectedMonth, 'yyyy-MM-dd');
    const monthEnd = format(endOfMonth(selectedMonth), 'yyyy-MM-dd');

    const [allBudgets, monthTransactions] = await Promise.all([
      Budget.filter({ month: monthStart }),
      Transaction.filter({ date: { gte: monthStart, lte: monthEnd } })
    ]);
    
    setBudgets(allBudgets);
    setTransactions(monthTransactions);
    setIsLoading(false);
  };
  
  const handleMonthChange = (direction) => {
    setSelectedMonth(prevMonth => {
      return direction === 'next' ? addMonths(prevMonth, 1) : subMonths(prevMonth, 1);
    });
  };

  const handleFormSubmit = async (formData) => {
    const budgetData = {
      ...formData,
      month: format(selectedMonth, 'yyyy-MM-dd')
    };

    if (editingBudget) {
      await Budget.update(editingBudget.id, budgetData);
    } else {
      await Budget.create(budgetData);
    }
    
    setIsFormOpen(false);
    setEditingBudget(null);
    loadBudgetData();
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  const handleDelete = async (budgetId) => {
    await Budget.delete(budgetId);
    loadBudgetData();
  };

  const openForm = () => {
    setEditingBudget(null);
    setIsFormOpen(true);
  };

  return (
    <div className="p-6 lg:p-8">
      <BudgetHeader 
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        onAddBudget={openForm}
      />
      
      <BudgetSummary budgets={budgets} transactions={transactions} isLoading={isLoading} />
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Budget Categories</h2>
        <BudgetList
          budgets={budgets}
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      <BudgetFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        budget={editingBudget}
        existingCategories={budgets.map(b => b.category)}
      />
    </div>
  );
}
