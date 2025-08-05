
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

const CATEGORY_COLORS = {
  'housing_rent': '#ef4444',
  'housing_utilities': '#f97316', 
  'food_groceries': '#84cc16',
  'food_dining': '#22c55e',
  'transportation_gas': '#06b6d4',
  'transportation_public': '#0ea5e9',
  'transportation_car': '#3b82f6',
  'healthcare_medical': '#8b5cf6',
  'healthcare_insurance': '#a855f7',
  'entertainment_movies': '#ec4899',
  'entertainment_hobbies': '#f43f5e',
  'shopping_clothing': '#10b981',
  'shopping_electronics': '#059669',
  'shopping_other': '#0d9488',
  'bills_phone': '#6366f1',
  'bills_internet': '#8b5cf6',
  'bills_subscriptions': '#a855f7',
  'other': '#6b7280'
};

export default function SpendingChart({ transactions }) {
  const expenseTransactions = transactions.filter(t => t.amount < 0);
  
  const categoryData = expenseTransactions.reduce((acc, transaction) => {
    const category = transaction.category;
    const categoryName = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    if (!acc[categoryName]) {
      acc[categoryName] = { name: categoryName, value: 0, color: CATEGORY_COLORS[category] || '#6b7280' };
    }
    acc[categoryName].value += Math.abs(transaction.amount);
    return acc;
  }, {});

  const chartData = Object.values(categoryData).sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border dark:border-gray-700">
          <p className="font-medium text-gray-700 dark:text-gray-300">{payload[0].name}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                strokeWidth={2}
                stroke="#fff"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <PieChartIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p>No expenses recorded yet</p>
              <p className="text-sm">Add some transactions to see your spending breakdown</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
