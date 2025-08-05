import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, X, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";

const CATEGORIES = {
  income: [
    { value: "income_salary", label: "Salary" },
    { value: "income_freelance", label: "Freelance" },
    { value: "income_other", label: "Other Income" }
  ],
  expense: [
    { value: "housing_rent", label: "Rent" },
    { value: "housing_utilities", label: "Utilities" },
    { value: "food_groceries", label: "Groceries" },
    { value: "food_dining", label: "Dining Out" },
    { value: "transportation_gas", label: "Gas" },
    { value: "transportation_public", label: "Public Transport" },
    { value: "transportation_car", label: "Car Expenses" },
    { value: "healthcare_medical", label: "Medical" },
    { value: "healthcare_insurance", label: "Insurance" },
    { value: "entertainment_movies", label: "Movies" },
    { value: "entertainment_hobbies", label: "Hobbies" },
    { value: "shopping_clothing", label: "Clothing" },
    { value: "shopping_electronics", label: "Electronics" },
    { value: "shopping_other", label: "Shopping" },
    { value: "bills_phone", label: "Phone" },
    { value: "bills_internet", label: "Internet" },
    { value: "bills_subscriptions", label: "Subscriptions" },
    { value: "education_courses", label: "Courses" },
    { value: "education_books", label: "Books" },
    { value: "savings_emergency", label: "Emergency Fund" },
    { value: "savings_retirement", label: "Retirement" },
    { value: "other", label: "Other" }
  ]
};

export default function TransactionForm({ transaction, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    amount: transaction?.amount ? Math.abs(transaction.amount).toString() : "",
    description: transaction?.description || "",
    category: transaction?.category || "",
    date: transaction?.date || format(new Date(), 'yyyy-MM-dd'),
    type: transaction?.amount ? (transaction.amount > 0 ? "income" : "expense") : "expense",
    is_recurring: transaction?.is_recurring || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    const finalAmount = formData.type === "income" ? amount : -amount;
    
    onSubmit({
      ...formData,
      amount: finalAmount
    });
  };

  const getAvailableCategories = () => {
    return formData.type === "income" ? CATEGORIES.income : CATEGORIES.expense;
  };

  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {formData.type === "income" ? (
            <TrendingUp className="w-5 h-5 text-green-600" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-600" />
          )}
          {transaction ? "Edit Transaction" : "Add New Transaction"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value, category: "" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableCategories().map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What was this transaction for?"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {transaction ? "Update" : "Save"} Transaction
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}