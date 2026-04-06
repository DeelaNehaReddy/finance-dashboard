import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, LineChart, Line, ComposedChart, Area, Legend, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Search, Plus, Trash2, Shield, Eye, TrendingUp, Wallet, ArrowDownCircle, ChevronDown, Check, Flame, Activity, PieChart as PieChartIcon, TrendingDown, Sparkles, BarChart2, Sun, Moon } from 'lucide-react';

const INITIAL_DATA = [
  { id: 1, date: '2026-03-25', amount: 48000, category: 'Salary', type: 'income' },
  { id: 2, date: '2026-03-26', amount: 2800, category: 'Groceries', type: 'expense' },
  { id: 3, date: '2026-03-27', amount: 9400, category: 'Housing', type: 'expense' },
  { id: 4, date: '2026-03-28', amount: 1900, category: 'Commute', type: 'expense' },
  { id: 5, date: '2026-04-01', amount: 3300, category: 'Utilities', type: 'expense' },
  { id: 6, date: '2026-04-03', amount: 11200, category: 'Freelance', type: 'income' },
  { id: 7, date: '2026-04-04', amount: 6200, category: 'Entertainment', type: 'expense' },
];

const TREND_DATA = [
  { day: 'Mon', balance: 42000 },
  { day: 'Tue', balance: 46000 },
  { day: 'Wed', balance: 51000 },
  { day: 'Thu', balance: 54000 },
  { day: 'Fri', balance: 62000 },
  { day: 'Sat', balance: 59000 },
  { day: 'Sun', balance: 64000 },
];

const CATEGORY_TREND_DATA = [
  { month: 'Jan', Housing: 8600, Groceries: 3300, Utilities: 1700, Entertainment: 2200, Commute: 1200 },
  { month: 'Feb', Housing: 8800, Groceries: 3900, Utilities: 1900, Entertainment: 3100, Commute: 1350 },
  { month: 'Mar', Housing: 9300, Groceries: 3500, Utilities: 1800, Entertainment: 2500, Commute: 1450 },
  { month: 'Apr', Housing: 9600, Groceries: 3800, Utilities: 2050, Entertainment: 4350, Commute: 1650 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 26 } },
};

const GRAPH_COLORS = ['#8b5cf6', '#06b6d4', '#f472b6', '#f59e0b', '#a855f7'];
const CARD_BG = 'bg-white dark:bg-slate-950/95';
const CARD_BORDER = 'border border-slate-200 dark:border-slate-800/80';

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`backdrop-blur-md border p-3 rounded-xl shadow-xl ${isDark ? 'bg-[#0f172a]/90 border-slate-700' : 'bg-white/90 border-gray-200'}`}>
        <p className={`text-xs font-semibold mb-1 uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{label}</p>
        <p className="text-blue-500 dark:text-blue-400 font-bold text-lg">
          ₹{payload[0].value.toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + entry.value, 0);
    return (
      <div className={`backdrop-blur-md border p-4 rounded-xl shadow-2xl min-w-[200px] animate-in fade-in zoom-in-95 duration-200 ${isDark ? 'bg-[#0f172a]/95 border-slate-700' : 'bg-white/95 border-gray-200'}`}>
        <div className={`flex justify-between items-center border-b pb-3 mb-3 ${isDark ? 'border-slate-700/50' : 'border-gray-200'}`}>
          <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{label} Total</p>
          <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>₹{total.toLocaleString('en-IN')}</p>
        </div>
        <div className="space-y-2.5">
          {[...payload].reverse().map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-6 text-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: entry.color }}></span>
                <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{entry.name}</span>
              </div>
              <span className={`font-mono font-medium ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>₹{entry.value.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

function StatCard({ title, value, icon }) {
  return (
    <motion.div 
      variants={itemVariants}
      className={`${CARD_BG} ${CARD_BORDER} relative overflow-hidden p-6 rounded-[32px] flex items-center justify-between shadow-2xl shadow-slate-950/40 transition hover:-translate-y-1`}
    >
      <div className="absolute -left-3 top-6 h-24 w-2 rounded-full bg-gradient-to-b from-fuchsia-500 to-violet-600 opacity-90" />
      <div className="relative z-10">
        <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-[0.22em] mb-2">{title}</p>
        <h4 className="text-3xl font-bold text-slate-950 dark:text-white tracking-tight">{value}</h4>
      </div>
      <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-fuchsia-500 via-violet-600 to-indigo-700 shadow-lg shadow-fuchsia-500/20 text-white">{icon}</div>
    </motion.div>
  );
}

export default function App() {
  const [role, setRole] = useState('Admin'); 
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === null ? true : savedTheme === 'dark';
  });

  useEffect(() => {
    const htmlRoot = document.documentElement;
    if (isDarkMode) {
      htmlRoot.classList.add('dark');
      htmlRoot.style.backgroundColor = '#050510';
      localStorage.setItem('theme', 'dark');
    } else {
      htmlRoot.classList.remove('dark');
      htmlRoot.style.backgroundColor = '#f9fafb'; 
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance-dashboard-data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('finance-dashboard-data', JSON.stringify(transactions));
  }, [transactions]);

  const filteredTransactions = transactions.filter(t => 
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });
    return { totalIncome: income, totalExpense: expense, balance: income - expense };
  }, [transactions]);

  const highestCategory = useMemo(() => {
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? { name: sorted[0][0], amount: sorted[0][1] } : null;
  }, [transactions]);

  const monthlyComparison = useMemo(() => {
    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const monthYear = t.date.substring(0, 7); 
        acc[monthYear] = (acc[monthYear] || 0) + t.amount;
        return acc;
      }, {});
    const sortedMonths = Object.keys(monthlyExpenses).sort();
    if (sortedMonths.length < 2) return null; 
    const currentTotal = monthlyExpenses[sortedMonths[sortedMonths.length - 1]];
    const previousTotal = monthlyExpenses[sortedMonths[sortedMonths.length - 2]];
    const percentChange = (((currentTotal - previousTotal) / previousTotal) * 100).toFixed(1);
    return { percentChange: Math.abs(percentChange), isIncrease: currentTotal > previousTotal };
  }, [transactions]);

  const aiObservation = useMemo(() => {
    if (!highestCategory || totalExpense === 0) return "Keep tracking your expenses to see insights here.";
    const percentage = Math.round((highestCategory.amount / totalExpense) * 100);
    if (percentage >= 40) {
      return `Watch out! ${highestCategory.name} makes up a massive ${percentage}% of your total expenses. Consider optimizing this budget.`;
    } else {
      return `Your spending is well diversified. Your biggest cost is ${highestCategory.name} at ${percentage}% of total expenses.`;
    }
  }, [highestCategory, totalExpense]);

  const handleSaveTransaction = (e) => {
    e.preventDefault(); 
    if (!formData.amount || !formData.category) return;
    const newTx = {
      id: Date.now(),
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type
    };
    setTransactions([newTx, ...transactions]);
    setShowModal(false); 
    setFormData({ amount: '', category: '', type: 'expense', date: new Date().toISOString().split('T')[0] });
  };

  const handleDelete = (id) => setTransactions(transactions.filter(t => t.id !== id));

  const axisColor = isDarkMode ? '#475569' : '#94a3b8';

  return (
    <div className={`flex min-h-screen overflow-hidden font-sans relative ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-950'}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.18),_transparent_30%)] pointer-events-none" />
      <motion.aside 
        initial={{ x: -120, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className={`relative z-10 w-64 p-6 hidden md:block shadow-2xl ${isDarkMode ? 'bg-slate-950/95 border-r border-slate-800/80 shadow-slate-950/20' : 'bg-white/95 border-r border-slate-200/80 shadow-slate-900/10'}`}
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/20"></div>
          <h2 className={`font-bold tracking-[0.24em] uppercase text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-950'}`}>Finance Dashboard</h2>
        </div>
        <nav className="space-y-4">
          <div onClick={() => setActiveTab('Overview')} className={`font-semibold cursor-pointer transition flex items-center gap-3 rounded-2xl px-4 py-3 ${activeTab === 'Overview' ? 'bg-slate-900 text-fuchsia-300 shadow-lg shadow-fuchsia-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-900/80'}`}>
            <PieChartIcon size={18}/> Overview
          </div>
          <div onClick={() => setActiveTab('Transactions')} className={`font-semibold cursor-pointer transition flex items-center gap-3 rounded-2xl px-4 py-3 ${activeTab === 'Transactions' ? 'bg-slate-900 text-fuchsia-300 shadow-lg shadow-fuchsia-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-900/80'}`}>
            <Wallet size={18}/> Transactions
          </div>
          <div onClick={() => setActiveTab('Insights')} className={`font-semibold cursor-pointer transition flex items-center gap-3 rounded-2xl px-4 py-3 ${activeTab === 'Insights' ? 'bg-slate-900 text-fuchsia-300 shadow-lg shadow-fuchsia-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-900/80'}`}>
            <Activity size={18}/> Insights
          </div>
        </nav>
      </motion.aside>

      <main className="flex-1 p-8 pb-24 md:pb-8 overflow-y-auto overflow-x-hidden">
        <motion.div variants={containerVariants} initial="hidden" animate="show" key={activeTab}>
          
          <motion.header variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 relative z-50 overflow-visible">
            <div>
              <h1 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>Finance dashboard for tracking money and spending</h1>
              <p className={`text-sm mt-2 max-w-xl ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {activeTab === 'Overview' && "Overview of balance, income, expenses, and category trends for quick insights."}
                {activeTab === 'Transactions' && "Browse and search your transaction history with role-based controls for Admin users."}
                {activeTab === 'Insights' && "See the highest spending categories, monthly comparisons, and smart budget observations."}
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto relative justify-end">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className={`hidden sm:inline-flex items-center justify-center p-3 rounded-2xl transition shadow-lg ${isDarkMode ? 'bg-slate-900/90 border border-slate-800 text-fuchsia-300 shadow-fuchsia-500/10 hover:bg-slate-800' : 'bg-slate-100 border border-slate-300 text-slate-950 shadow-slate-300/40 hover:bg-slate-200'}`}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="relative flex flex-col w-auto overflow-visible">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={`inline-flex items-center justify-center gap-3 px-4 py-2.5 rounded-2xl transition cursor-pointer shadow-lg ${isDarkMode ? 'bg-slate-900/95 border border-slate-800 text-slate-200 shadow-slate-950/30 hover:bg-slate-800' : 'bg-white border border-slate-200 text-slate-950 shadow-slate-300/40 hover:bg-slate-100'}`}>
                  {role === 'Admin' ? <Shield size={18} className="text-fuchsia-300" /> : <Eye size={18} className="text-emerald-300" />}
                  <span className="text-sm font-semibold">Role: {role}</span>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className={`absolute left-0 top-full mt-2 min-w-[12rem] rounded-3xl shadow-2xl z-60 overflow-hidden backdrop-blur-xl ${isDarkMode ? 'bg-slate-950/95 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                    <button onClick={() => { setRole('Admin'); setIsDropdownOpen(false); }} className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition ${isDarkMode ? 'text-slate-100 hover:bg-slate-900' : 'text-slate-950 hover:bg-slate-100'}`}>
                      <div className="flex items-center gap-3"><Shield size={16} className="text-fuchsia-400" /><span className={`text-sm ${role === 'Admin' ? `font-bold ${isDarkMode ? 'text-white' : 'text-slate-950'}` : 'text-slate-400'}`}>Admin</span></div>
                      {role === 'Admin' && <Check size={16} className="text-fuchsia-400" />}
                    </button>
                    <button onClick={() => { setRole('Viewer'); setIsDropdownOpen(false); }} className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition ${isDarkMode ? 'text-slate-100 hover:bg-slate-900' : 'text-slate-950 hover:bg-slate-100'}`}>
                      <div className="flex items-center gap-3"><Eye size={16} className="text-emerald-400" /><span className={`text-sm ${role === 'Viewer' ? `font-bold ${isDarkMode ? 'text-white' : 'text-slate-950'}` : 'text-slate-400'}`}>Viewer</span></div>
                      {role === 'Viewer' && <Check size={16} className="text-emerald-400" />}
                    </button>
                  </div>
                )}
                <p className={`mt-2 text-[11px] max-w-xs leading-snug ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {role === 'Admin' ? 'Admin can add or remove transactions.' : 'Viewer can only read the data and cannot modify transactions.'}
                </p>
              </div>
            </div>
          </motion.header>

          {(activeTab === 'Overview' || activeTab === 'Insights') && (
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
              <StatCard title="Total Balance" value={`₹${balance.toLocaleString('en-IN')}`} icon={<Wallet className="text-cyan-400"/>} />
              <StatCard title="Total Income" value={`+₹${totalIncome.toLocaleString('en-IN')}`} icon={<TrendingUp className="text-emerald-400"/>} />
              <StatCard title="Total Expenses" value={`-₹${totalExpense.toLocaleString('en-IN')}`} icon={<ArrowDownCircle className="text-rose-400"/>} />
            </motion.div>
          )}

          {(activeTab === 'Overview' || activeTab === 'Insights') && (
            <motion.div variants={containerVariants} className="flex flex-col gap-8 mb-10">
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
    
                <motion.div variants={itemVariants} className="lg:col-span-3 bg-white dark:bg-gradient-to-b dark:from-[#111122] dark:to-[#0a0a14] p-6 rounded-3xl border border-gray-200 dark:border-slate-800/80 shadow-xl dark:shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-fuchsia-500/10 blur-[50px] rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <h3 className={`font-bold text-sm uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}><Activity size={16} className="text-fuchsia-400" /> Balance Over Time</h3>
                    <span className="text-xs font-medium bg-gray-100 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-700/50">Last 7 Days</span>
                  </div>
                  <div className="h-64 w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={TREND_DATA} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="balanceLineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
                            <stop offset="100%" stopColor="#22d3ee" stopOpacity={1} />
                          </linearGradient>
                          <linearGradient id="balanceFillGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity={0.28} />
                            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke={isDarkMode ? '#17233f' : '#e2e8f0'} strokeDasharray="4 4" />
                        <XAxis dataKey="day" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                        <RechartsTooltip content={<CustomTooltip isDark={isDarkMode} />} cursor={{ stroke: '#a855f7', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Line type="monotone" dataKey="balance" stroke="url(#balanceLineGradient)" strokeWidth={4} dot={{ r: 5, fill: '#ffffff', stroke: '#a855f7', strokeWidth: 3 }} activeDot={{ r: 8, fill: '#ffffff', stroke: '#22d3ee', strokeWidth: 4 }} />
                        <Area type="monotone" dataKey="balance" stroke="none" fill="url(#balanceFillGradient)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-gradient-to-b dark:from-[#111122] dark:to-[#0a0a14] p-6 rounded-3xl border border-gray-200 dark:border-slate-800/80 shadow-xl dark:shadow-2xl relative overflow-hidden">
                  <h3 className={`font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}><PieChartIcon size={16} className="text-purple-500" /> Spending Breakdown</h3>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-40 h-40 relative flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={transactions.filter(t => t.type === 'expense')} dataKey="amount" nameKey="category" innerRadius={55} outerRadius={80} paddingAngle={3} stroke="none" onMouseEnter={(data) => setHoveredSlice({ name: data.name, amount: data.value })} onMouseLeave={() => setHoveredSlice(null)}>
                            {transactions.filter(t => t.type === 'expense').map((_, i) => <Cell key={`cell-${i}`} fill={GRAPH_COLORS[i % GRAPH_COLORS.length]} className="cursor-pointer outline-none transition-all duration-300 hover:opacity-80" />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
                        <span className="text-gray-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider truncate w-full">{hoveredSlice ? hoveredSlice.name : "Total"}</span>
                        <span className="text-gray-900 dark:text-white font-bold text-lg leading-tight transition-all duration-300">₹{hoveredSlice ? (hoveredSlice.amount >= 1000 ? (hoveredSlice.amount/1000).toFixed(1) + 'k' : hoveredSlice.amount) : (totalExpense/1000).toFixed(1) + 'k'}</span>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center space-y-4 w-full">
                      <div className="bg-gray-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-gray-200 dark:border-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-800/60 transition">
                        <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}><Flame size={12} className="text-rose-500"/> Top Spend</p>
                        <p className={`font-bold text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
{highestCategory ? `${highestCategory.name} ` : "No data"}<span className="text-gray-500 dark:text-slate-400 font-medium text-xs ml-1">(₹{highestCategory?.amount.toLocaleString('en-IN')})</span></p>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-gray-200 dark:border-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-800/60 transition">
                        <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}><TrendingDown size={12} className="text-emerald-500"/> Monthly Trend</p>
                        {monthlyComparison ? <p className={`text-sm font-bold flex items-center gap-1 ${monthlyComparison.isIncrease ? (isDarkMode ? 'text-rose-400' : 'text-rose-500') : (isDarkMode ? 'text-emerald-400' : 'text-emerald-500')}`}>{monthlyComparison.isIncrease ? '▲' : '▼'} {monthlyComparison.percentChange}% <span className={`font-medium text-[10px] uppercase tracking-wider ml-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>vs last mo</span></p> : <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Need more data</p>}
                      </div>
                    </div>
                  </div>
                  
            
                </motion.div>
              </div>
              
              <motion.div variants={itemVariants} className={`p-6 rounded-3xl border relative overflow-hidden shadow-xl ${isDarkMode ? 'bg-gradient-to-b from-[#111122] to-[#0a0a14] border-slate-800/80 shadow-2xl' : 'bg-white border-gray-200 shadow-slate-900/10'}`}>
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h3 className="text-gray-900 dark:text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                    <BarChart2 size={16} className="text-emerald-500" /> Spending Categories
                  </h3>
                  <span className="text-xs font-medium bg-gray-100 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-700/50">Year to Date</span>
                </div>
                
                <div className="h-72 w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={CATEGORY_TREND_DATA} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="housingArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="groceriesArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="entertainmentArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="utilArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="commuteArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" stroke={isDarkMode ? '#17233f' : '#e2e8f0'} vertical={false} />
                      <XAxis dataKey="month" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                      <RechartsTooltip 
                        cursor={{ fill: isDarkMode ? '#334155' : '#f1f5f9', opacity: isDarkMode ? 0.15 : 0.5 }}
                        content={<CustomBarTooltip isDark={isDarkMode} />}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: axisColor, paddingTop: '20px' }} />
                      <Area type="monotone" dataKey="Housing" stackId="1" stroke="#8b5cf6" fill="url(#housingArea)" strokeWidth={2} dot={false} />
                      <Area type="monotone" dataKey="Groceries" stackId="1" stroke="#06b6d4" fill="url(#groceriesArea)" strokeWidth={2} dot={false} />
                      <Area type="monotone" dataKey="Entertainment" stackId="1" stroke="#ec4899" fill="url(#entertainmentArea)" strokeWidth={2} dot={false} />
                      <Area type="monotone" dataKey="Utilities" stackId="1" stroke="#f59e0b" fill="url(#utilArea)" strokeWidth={2} dot={false} />
                      <Area type="monotone" dataKey="Commute" stackId="1" stroke="#a855f7" fill="url(#commuteArea)" strokeWidth={2} dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

            </motion.div>
          )}

          {(activeTab === 'Overview' || activeTab === 'Transactions') && (
            <motion.section variants={itemVariants} className={`rounded-2xl overflow-hidden shadow-xl ${isDarkMode ? 'bg-[#111122] border border-slate-800 shadow-lg' : 'bg-white border border-gray-200'}`}>
              <div className={`p-6 flex flex-col sm:flex-row justify-between items-center gap-4 ${isDarkMode ? 'border-b border-slate-800' : 'border-b border-gray-200'}`}>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>Recent Transactions</h3>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-start sm:items-center">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-slate-500" size={16} />
                    <input type="text" placeholder="Filter by category..." className="w-full bg-gray-50 dark:bg-[#050510] border border-gray-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-blue-500 outline-none transition text-gray-900 dark:text-white" onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {role === 'Admin' ? (
                      <button onClick={() => setShowModal(true)} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 whitespace-nowrap"><Plus size={16}/> Add Transaction</button>
                    ) : (
                      <button disabled className="bg-slate-700 text-slate-400 px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 whitespace-nowrap opacity-60 cursor-not-allowed"><Plus size={16}/> Add Transaction</button>
                    )}
                  </div>
                </div>
                {role === 'Viewer' && (
                  <p className="mt-3 text-xs text-slate-400 italic">Viewer mode is read-only: you can inspect transactions but not add or remove entries.</p>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-[#1a1a30] text-gray-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Amount</th>
                      {role === 'Admin' && <th className="px-6 py-4 text-right">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                    {filteredTransactions.map(t => (
                      <motion.tr key={t.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-gray-50 dark:hover:bg-white/5 transition group">
                        <td className="px-6 py-4 text-xs text-gray-500 dark:text-slate-500 whitespace-nowrap">{t.date}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-slate-200">{t.category}</td>
                        <td className="px-6 py-4 capitalize text-xs"><span className={`px-2 py-1 rounded-full bg-opacity-10 ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10' : 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-400/10'}`}>{t.type}</span></td>
                        <td className={`px-6 py-4 font-mono font-bold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>{t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}</td>
                        {role === 'Admin' && <td className="px-6 py-4 text-right"><button onClick={() => handleDelete(t.id)} className="text-gray-400 dark:text-slate-600 hover:text-rose-500 transition"><Trash2 size={16}/></button></td>}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredTransactions.length === 0 && <div className="p-10 text-center text-gray-500 dark:text-slate-600 italic">No transactions found.</div>}
            </motion.section>
          )}
        </motion.div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#0a0a14]/90 backdrop-blur-lg border-t border-gray-200 dark:border-slate-800 flex justify-around p-4 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <button onClick={() => setActiveTab('Overview')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'Overview' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-slate-500 hover:text-gray-800 dark:hover:text-slate-300'}`}><PieChartIcon size={20} /><span className="text-[10px] font-bold uppercase tracking-widest">Overview</span></button>
        <button onClick={() => setActiveTab('Transactions')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'Transactions' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-slate-500 hover:text-gray-800 dark:hover:text-slate-300'}`}><Wallet size={20} /><span className="text-[10px] font-bold uppercase tracking-widest">Transact</span></button>
        <button onClick={() => setActiveTab('Insights')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'Insights' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-slate-500 hover:text-gray-800 dark:hover:text-slate-300'}`}><Activity size={20} /><span className="text-[10px] font-bold uppercase tracking-widest">Insights</span></button>
      </nav>

      {showModal && role === 'Admin' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-[#111122] border border-gray-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add New Transaction</h3>
            <form onSubmit={handleSaveTransaction} className="space-y-4">
              <div className="flex gap-4 mb-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300 cursor-pointer"><input type="radio" name="type" value="expense" checked={formData.type === 'expense'} onChange={(e) => setFormData({...formData, type: e.target.value})} className="accent-rose-500"/> Expense</label>
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300 cursor-pointer"><input type="radio" name="type" value="income" checked={formData.type === 'income'} onChange={(e) => setFormData({...formData, type: e.target.value})} className="accent-emerald-500"/> Income</label>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-500 uppercase mb-1">Amount (₹)</label>
                <input type="number" required min="0" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full bg-gray-50 dark:bg-[#050510] border border-gray-200 dark:border-slate-800 rounded-lg p-3 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition" placeholder="e.g. 1500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-500 uppercase mb-1">Category</label>
                <input type="text" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 dark:bg-[#050510] border border-gray-200 dark:border-slate-800 rounded-lg p-3 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition" placeholder="e.g. Groceries, Salary, Rent" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-500 uppercase mb-1">Date</label>
                <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-gray-50 dark:bg-[#050510] border border-gray-200 dark:border-slate-800 rounded-lg p-3 text-gray-700 dark:text-slate-300 outline-none focus:border-blue-500 transition [color-scheme:light] dark:[color-scheme:dark]" />
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-slate-800/50">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-bold rounded-lg transition shadow-lg shadow-fuchsia-500/20">Save Entry</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}