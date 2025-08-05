

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Receipt, 
  Target, 
  PiggyBank, 
  Bot,
  Menu,
  X,
  Sun, // Added for dark mode toggle
  Moon // Added for dark mode toggle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
    color: "text-blue-600"
  },
  {
    title: "Transactions", 
    url: createPageUrl("Transactions"),
    icon: Receipt,
    color: "text-green-600"
  },
  {
    title: "Budget",
    url: createPageUrl("Budget"), 
    icon: Target,
    color: "text-purple-600"
  },
  {
    title: "Goals",
    url: createPageUrl("Goals"),
    icon: PiggyBank,
    color: "text-orange-600"
  },
  {
    title: "Assistant",
    url: createPageUrl("Assistant"),
    icon: Bot,
    color: "text-indigo-600",
    isPremium: true
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light'); // State for managing theme

  // Effect to load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('balsano-theme') || 'light';
    setTheme(savedTheme);
  }, []);

  // Effect to apply theme class and save to localStorage whenever theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('balsano-theme', theme);
  }, [theme]);

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/20 dark:from-gray-900 dark:via-blue-900/20 dark:to-green-900/10 text-gray-800 dark:text-gray-200">
      <style>{`
        :root {
          --primary: 219 100% 62%;
          --primary-foreground: 0 0% 100%;
          --secondary: 162 100% 45%;
          --secondary-foreground: 0 0% 100%;
          --muted: 220 14% 96%;
          --muted-foreground: 220 9% 46%;
          --accent: 276 100% 68%;
          --accent-foreground: 0 0% 100%;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .dark .glass-card {
          background: rgba(31, 41, 55, 0.6); /* gray-800 with 60% opacity */
          backdrop-filter: blur(12px);
          border: 1px solid rgba(75, 85, 99, 0.5); /* gray-600 with 50% opacity */
        }
      `}</style>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white/90 dark:bg-gray-900/80 backdrop-blur-md border-b border-white/20 dark:border-white/10 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Balsano
            </h1>
          </div>
          <div className="flex items-center"> {/* Added wrapper for theme toggle and menu button */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 glass-card m-6 rounded-2xl shadow-xl">
          <div className="p-8 border-b border-white/10 dark:border-gray-700/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Balsano
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Smart Budgeting</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    location.pathname === item.url
                      ? 'bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-200/50 dark:border-blue-800/50'
                      : 'hover:bg-white/60 dark:hover:bg-gray-700/50 hover:shadow-sm'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${
                    location.pathname === item.url ? item.color : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                  }`} />
                  <span className={`font-medium ${
                    location.pathname === item.url ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                  }`}>
                    {item.title}
                  </span>
                  {item.isPremium && (
                    <span className="ml-auto px-2 py-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                      Pro
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </nav>

          <div className="p-6 border-t border-white/10 dark:border-gray-700/30">
            <div className="glass-card p-4 rounded-xl mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Get personalized financial advice with our AI assistant
              </p>
              <Link to={createPageUrl("Assistant")}>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Try Assistant - $2.99/mo
                </Button>
              </Link>
            </div>
            <Button variant="outline" onClick={toggleTheme} className="w-full rounded-full dark:bg-gray-700/50 dark:border-gray-600">
                <Sun className="h-5 w-5 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 mr-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span>Toggle Theme</span>
            </Button>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="glass-card dark:bg-gray-800/95 w-80 h-full p-6" onClick={(e) => e.stopPropagation()}>
              <nav className="mt-8">
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.url}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        location.pathname === item.url
                          ? 'bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-200/50 dark:border-blue-800/50'
                          : 'hover:bg-white/60 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${
                        location.pathname === item.url ? item.color : 'text-gray-500 dark:text-gray-400'
                      }`} />
                      <span className="font-medium text-gray-700 dark:text-gray-200">{item.title}</span>
                      {item.isPremium && (
                        <span className="ml-auto px-2 py-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                          Pro
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:mr-6 lg:my-6">
          <div className="glass-card lg:rounded-2xl lg:shadow-xl min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-3rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

