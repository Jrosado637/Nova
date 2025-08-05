import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";

const CATEGORIES = [
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
];

export default function BudgetFormModal({ isOpen, onClose, onSubmit, budget, existingCategories }) {
  const [formData, setFormData] = useState({ category: '', monthly_limit: '' });

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        monthly_limit: budget.monthly_limit
      });
    } else {
      setFormData({ category: '', monthly_limit: '' });
    }
  }, [budget, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      monthly_limit: parseFloat(formData.monthly_limit)
    });
  };

  const availableCategories = CATEGORIES.filter(c => 
    !existingCategories.includes(c.value) || (budget && budget.category === c.value)
  );

  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card">
        <DialogHeader>
          <DialogTitle>{budget ? "Edit Budget" : "Add Budget"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(f => ({ ...f, category: value }))}
              disabled={!!budget}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthly_limit">Monthly Limit</Label>
            <Input
              id="monthly_limit"
              type="number"
              step="0.01"
              min="0"
              value={formData.monthly_limit}
              onChange={(e) => setFormData(f => ({ ...f, monthly_limit: e.target.value }))}
              placeholder="e.g., 500"
              required
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Save className="w-4 h-4 mr-2" />
              {budget ? "Save Changes" : "Add Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}