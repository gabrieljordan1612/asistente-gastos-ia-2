import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Expense, Category } from '../types';
// FIX: Import PALETTE to use centralized color definitions.
import { PALETTE } from '../constants';


const formatCurrency = (value: number) => `S/. ${value.toFixed(2)}`;

const CustomTooltip = ({ active, payload, label, chartMode }: any) => {
    if (active && payload && payload.length) {
        const title = chartMode === 'byDay' ? `Día ${label}` : label;
        return (
            <div className="bg-surface p-2 border border-border rounded-md shadow-lg">
                <p className="font-bold text-text-primary">{title}</p>
                <p className="text-primary">{`Total: ${formatCurrency(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

const ExpenseCalendarChart: React.FC<{
    expenses: Expense[];
    categories: Category[];
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    selectedDate: string | null;
    setSelectedDate: (date: string | null) => void;
    chartMode?: 'byCategory' | 'byDay';
    barColor?: string;
}> = ({ expenses, categories, currentDate, setCurrentDate, selectedDate, setSelectedDate, chartMode = 'byCategory', barColor }) => {
    
    const expensesByDay = useMemo(() => {
        const map = new Map<string, Expense[]>();
        expenses.forEach(expense => {
            const dateStr = expense.date; // YYYY-MM-DD
            if (!map.has(dateStr)) {
                map.set(dateStr, []);
            }
            map.get(dateStr)!.push(expense);
        });
        return map;
    }, [expenses]);
    
    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(null);
    };
    
    const handleDayClick = (dateStr: string) => {
       setSelectedDate(dateStr);
    };

    const { monthName, year, days, firstDayOfWeek } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(currentDate);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let firstDayOfWeek = new Date(year, month, 1).getDay();
        if (firstDayOfWeek === 0) firstDayOfWeek = 6;
        else firstDayOfWeek -= 1; 

        const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        return { monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1), year, days: daysArray, firstDayOfWeek };
    }, [currentDate]);

    // Data for 'byCategory' chart (Dashboard)
    const categoryChartData = useMemo(() => {
        if (chartMode !== 'byCategory' || !selectedDate) return [];
        const selectedDayExpenses = expensesByDay.get(selectedDate) || [];
        if (selectedDayExpenses.length === 0) return [];

        // FIX: Use the hex value from the imported PALETTE.
        const categoryColorMap = new Map(categories.map(c => [c.name, PALETTE[c.color]?.hex || PALETTE.gray.hex]));
        
        const dataByCategory: { [key: string]: number } = {};
        selectedDayExpenses.forEach(expense => {
            const category = expense.category || 'Sin categoría';
            dataByCategory[category] = (dataByCategory[category] || 0) + expense.amount;
        });
        
        return Object.entries(dataByCategory).map(([name, amount]) => ({
            name,
            amount,
            color: categoryColorMap.get(name) || PALETTE.gray.hex,
        })).sort((a,b) => b.amount - a.amount);
    }, [selectedDate, expensesByDay, chartMode, categories]);
    
    const totalForSelectedDay = useMemo(() => {
        if (!selectedDate) return 0;
        const selectedDayExpenses = expensesByDay.get(selectedDate) || [];
        return selectedDayExpenses.reduce((total, expense) => total + expense.amount, 0);
    }, [selectedDate, expensesByDay]);

    // Data for 'byDay' chart (Category View)
    const dailyChartData = useMemo(() => {
        if (chartMode !== 'byDay') return null;

        const currentMonthStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        const dataByDay: { [key: number]: number } = {};

        expenses.forEach(expense => {
            if (expense.date.startsWith(currentMonthStr)) {
                const day = parseInt(expense.date.split('-')[2], 10);
                dataByDay[day] = (dataByDay[day] || 0) + expense.amount;
            }
        });

        return Array.from({ length: days.length }, (_, i) => {
            const day = i + 1;
            return {
                name: String(day),
                amount: dataByDay[day] || 0,
            };
        });
    }, [expenses, currentDate, year, days, chartMode]);

    const weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
    
    const renderByCategoryChart = () => (
        selectedDate && (
            <div className="mt-8 pt-6 border-t border-border animate-fade-in-up">
                 <h3 className="text-lg font-bold text-text-primary mb-4">
                    Gastos del {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                    {categoryChartData.length > 0 && (
                        <span className="ml-2 font-semibold text-primary">
                            ({formatCurrency(totalForSelectedDay)})
                        </span>
                    )}
                 </h3>
                {categoryChartData.length > 0 ? (
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <BarChart data={categoryChartData} margin={{ top: 5, right: 0, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} interval={0} />
                                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `S/.${value}`} width={80} />
                                <Tooltip content={<CustomTooltip chartMode={chartMode} />} cursor={{fill: '#F9FAFB'}}/>
                                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                    {categoryChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-[250px] flex items-center justify-center text-center text-text-secondary">
                        <p>No hay gastos registrados para este día.</p>
                    </div>
                )}
            </div>
        )
    );
    
    const renderByDayChart = () => (
        dailyChartData && (
            <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-lg font-bold text-text-primary mb-4">
                    Gastos Diarios en {monthName}
                </h3>
                 <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <BarChart data={dailyChartData} margin={{ top: 5, right: 0, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} interval={0} />
                            <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `S/.${value}`} width={80} />
                            <Tooltip content={<CustomTooltip chartMode={chartMode} />} cursor={{fill: '#F9FAFB'}}/>
                            {/* FIX: Use the hex value from the imported PALETTE for the bar color. */}
                            <Bar dataKey="amount" fill={barColor && PALETTE[barColor] ? PALETTE[barColor].hex : '#3B82F6'} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-primary capitalize">Mes de {monthName}, {year}</h2>
                <div className="flex space-x-2">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-border transition-colors" aria-label="Mes anterior">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-border transition-colors" aria-label="Mes siguiente">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
                {weekDays.map(day => <div key={day} className="font-bold text-sm text-text-secondary pb-2">{day}</div>)}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {days.map(day => {
                    const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const hasExpenses = expensesByDay.has(dateStr);
                    const isSelected = selectedDate === dateStr;
                    
                    return (
                        <div key={day} onClick={() => handleDayClick(dateStr)} className="p-2 rounded-lg transition-colors cursor-pointer hover:bg-primary/10" role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleDayClick(dateStr)}>
                            <div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full relative ${isSelected ? 'bg-primary text-white font-bold' : 'text-text-primary'}`}>
                                {day}
                                {hasExpenses && <div className={`absolute bottom-0 h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`}></div>}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {chartMode === 'byDay' ? renderByDayChart() : renderByCategoryChart()}
        </div>
    );
};

export default ExpenseCalendarChart;