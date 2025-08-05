
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function DashboardStats({ title, value, icon: Icon, color, bgColor, trend }) {
  return (
    <Card className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                {parseFloat(trend) >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                )}
                <span className={`text-sm font-medium ${
                  parseFloat(trend) >= 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {trend} from last month
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${bgColor} dark:bg-opacity-20`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
