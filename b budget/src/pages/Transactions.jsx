
import React, { useState, useEffect } from "react";
import { Transaction } from "@/api/entities";
import { Plus, Search, Filter, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";
import TransactionFilters from "../components/transactions/TransactionFilters";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    type: "all",
    dateRange: "all"
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    const data = await Transaction.list('-date');
    setTransactions(data);
    setIsLoading(false);
  };

  const handleSubmit = async (transactionData) => {
    if (editingTransaction) {
      await Transaction.update(editingTransaction.id, transactionData);
    } else {
      await Transaction.create(transactionData);
    }
    setShowForm(false);
    setEditingTransaction(null);
    loadTransactions();
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (transactionId) => {
    await Transaction.delete(transactionId);
    loadTransactions();
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filters.category === "all" || transaction.category === filters.category;
    const matchesType = filters.type === "all" || 
                       (filters.type === "income" && transaction.amount > 0) ||
                       (filters.type === "expense" && transaction.amount < 0);
    
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your income and expenses</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 w-full lg:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Transaction
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <TransactionForm
            transaction={editingTransaction}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingTransaction(null);
            }}
          />
        </div>
      )}

      <div className="glass-card p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 dark:bg-gray-800/50"
            />
          </div>
          <TransactionFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
