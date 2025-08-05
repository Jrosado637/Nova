import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function GoalsOverview({ goals }) {
  const activeGoals = goals.filter(g => !g.is_completed).slice(0, 3);

  const getGoalProgress = (goal) => {
    return ((goal.current_amount || 0) / goal.target_amount) * 100;
  };

  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-gray-900">Financial Goals</CardTitle>
        <Link to={createPageUrl("Goals")}>
          <Button variant="outline" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        {activeGoals.length > 0 ? (
          <div className="space-y-6">
            {activeGoals.map((goal) => {
              const progress = getGoalProgress(goal);
              return (
                <div key={goal.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    <span className="text-sm text-gray-500">
                      Due {format(new Date(goal.target_date), 'MMM yyyy')}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-pink-500" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      ${(goal.current_amount || 0).toFixed(2)} / ${goal.target_amount.toFixed(2)}
                    </span>
                    <span className="text-orange-600 font-medium">
                      {progress.toFixed(1)}% complete
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-gray-600 mb-2">No goals set</p>
            <p className="text-sm text-gray-500 mb-4">Create goals to stay motivated</p>
            <Link to={createPageUrl("Goals")}>
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                Set First Goal
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}