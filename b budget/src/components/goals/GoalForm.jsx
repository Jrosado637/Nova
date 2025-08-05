import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";
import { format } from "date-fns";

export default function GoalForm({ goal, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_amount: '',
    target_date: ''
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description || '',
        target_amount: goal.target_amount,
        target_date: format(new Date(goal.target_date), 'yyyy-MM-dd')
      });
    } else {
      setFormData({
        title: '',
        description: '',
        target_amount: '',
        target_date: ''
      });
    }
  }, [goal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      target_amount: parseFloat(formData.target_amount)
    });
  };

  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle>{goal ? "Edit Goal" : "Set New Goal"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input 
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(f => ({...f, title: e.target.value}))}
              placeholder="e.g., Save for a New Car"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(f => ({...f, description: e.target.value}))}
              placeholder="A brief description of your goal"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="target_amount">Target Amount</Label>
              <Input
                id="target_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.target_amount}
                onChange={(e) => setFormData(f => ({...f, target_amount: e.target.value}))}
                placeholder="1000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_date">Target Date</Label>
              <Input
                id="target_date"
                type="date"
                value={formData.target_date}
                onChange={(e) => setFormData(f => ({...f, target_date: e.target.value}))}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-orange-500 to-pink-500">
              <Save className="w-4 h-4 mr-2" />
              {goal ? "Save Changes" : "Set Goal"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}