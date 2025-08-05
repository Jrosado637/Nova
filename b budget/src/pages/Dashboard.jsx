import React, { useState, useEffect } from "react";
import { Transaction, Budget, Goal, User } from "@/api/entities";
import { TrendingUp, TrendingDown, Target, PiggyBank, AlertCircle, CheckCircle } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

import DashboardStats from "../components/dashboard/DashboardStats";
import SpendingChart from "../components/dashboard/SpendingChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import BudgetProgress from "../components/dashboard/BudgetProgress";
import GoalsOverview from "../components/dashboard/GoalsOverview";
import WelcomeMessage from "../components/dashboard/WelcomeMessage";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [transactionsData, budgetsData, goalsData, userData] = await Promise.all([
        Transaction.list('-date', 50),
        Budget.list(),
        Goal.list(),
        User.me().catch(() => null)
      ]);
      
      setTransactions(transactionsData);
      setBudgets(budgetsData);
      setGoals(goalsData);
      setUser(userData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentMonthTransactions = () => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });
  };

  const calculateStats = () => {
    const currentMonth = getCurrentMonthTransactions();
    const income = currentMonth.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = Math.abs(currentMonth.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
    
    // Previous month comparison
    const lastMonth = subMonths(new Date(), 1);
    const lastMonthStart = startOfMonth(lastMonth);
    const lastMonthEnd = endOfMonth(lastMonth);
    const lastMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= lastMonthStart && transactionDate <= lastMonthEnd;
    });
    const lastMonthExpenses = Math.abs(lastMonthTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
    
    return {
      income,
      expenses,
      balance: income - expenses,
      expenseChange: lastMonthExpenses > 0 ? ((expenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <WelcomeMessage user={user} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <DashboardStats
          title="Monthly Income"
          value={`$${stats.income.toFixed(2)}`}
          icon={TrendingUp}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <DashboardStats
          title="Monthly Expenses"
          value={`$${stats.expenses.toFixed(2)}`}
          icon={TrendingDown}
          color="text-red-600" 
          bgColor="bg-red-100"
          trend={stats.expenseChange !== 0 ? `${stats.expenseChange > 0 ? '+' : ''}${stats.expenseChange.toFixed(1)}%` : null}
        />
        <DashboardStats
          title="Available Balance"
          value={`$${stats.balance.toFixed(2)}`}
          icon={stats.balance >= 0 ? CheckCircle : AlertCircle}
          color={stats.balance >= 0 ? "text-blue-600" : "text-orange-600"}
          bgColor={stats.balance >= 0 ? "bg-blue-100" : "bg-orange-100"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SpendingChart transactions={getCurrentMonthTransactions()} />
        <BudgetProgress budgets={budgets} transactions={getCurrentMonthTransactions()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions transactions={transactions.slice(0, 10)} />
        <GoalsOverview goals={goals} />
      </div>
    </div>
  );
}