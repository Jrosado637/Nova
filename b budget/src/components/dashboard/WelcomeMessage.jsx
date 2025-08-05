
import React from "react";
import { Heart, Sparkles } from "lucide-react";

export default function WelcomeMessage({ user }) {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const encouragingMessages = [
    "You're doing great with your financial journey!",
    "Every small step counts towards your financial goals.",
    "Building good money habits takes time - be patient with yourself.",
    "You're in control of your financial future.",
    "Remember, progress over perfection!"
  ];

  const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {getTimeBasedGreeting()}{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
        </h1>
        <Sparkles className="w-6 h-6 text-yellow-500" />
      </div>
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <Heart className="w-4 h-4 text-pink-500" />
        <p className="text-lg">{randomMessage}</p>
      </div>
    </div>
  );
}
