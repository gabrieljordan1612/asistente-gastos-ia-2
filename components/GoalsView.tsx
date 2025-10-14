import React, { useState, useMemo } from 'react';
import type { Goal, GoalContribution } from '../types';

const formatCurrency = (amount: number) => `S/. ${amount.toFixed(2)}`;

const GoalCard: React.FC<{
  goal: Goal;
  contributions: GoalContribution[];
  onAddContributionClick: (goal: Goal) => void;
  onDeleteGoal: (id: number) => void;
  onDeleteContribution: (id: number) => void;
}> = ({ goal, contributions, onAddContributionClick, onDeleteGoal, onDeleteContribution }) => {
  const percentage = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
  const isCompleted = goal.current_amount >= goal.target_amount;

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-xl shadow-sm p-6 flex flex-col">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <span className="text-4xl">{goal.emoji}</span>
          <div>
            <h3 className="text-xl font-bold text-text-primary">{goal.name}</h3>
            <p className="text-sm text-text-secondary">
              Meta: {formatCurrency(goal.target_amount)} | Vence: {new Date(goal.target_date + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="relative group">
            <button className="p-2 text-text-secondary hover:text-text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-surface border border-border rounded-md shadow-lg z-10 hidden group-hover:block">
                 <button onClick={() => setIsExpanded(!isExpanded)} className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bkg">
                    {isExpanded ? 'Ocultar Aportes' : 'Ver Aportes'}
                </button>
                <button onClick={() => onDeleteGoal(goal.id)} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Eliminar Meta
                </button>
            </div>
        </div>
      </div>

      <div className="mt-4 flex-grow">
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-text-primary">{formatCurrency(goal.current_amount)}</span>
          <span className={isCompleted ? 'text-green-600' : 'text-text-secondary'}>{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-border rounded-full h-4 mt-1">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border animate-fade-in-up" style={{animationDuration: '0.3s'}}>
            <h4 className="font-semibold text-text-secondary text-sm mb-2">Aportes Recientes</h4>
            {contributions.length > 0 ? (
                 <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                    {contributions.map(c => (
                        <div key={c.id} className="flex justify-between items-center text-sm p-2 bg-bkg rounded-md group">
                            <div>
                                <span className="font-medium text-text-primary">{formatCurrency(c.amount)}</span>
                                <span className="text-text-secondary ml-2">{new Date(c.date + 'T00:00:00').toLocaleDateString('es-ES')}</span>
                            </div>
                            <button onClick={() => onDeleteContribution(c.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    ))}
                 </div>
            ) : (
                <p className="text-sm text-text-secondary text-center py-4">Aún no hay aportes para esta meta.</p>
            )}
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={() => onAddContributionClick(goal)}
          disabled={isCompleted}
          className="w-full bg-primary/10 text-primary font-bold py-2 px-4 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary/10"
        >
          {isCompleted ? '¡Meta Completada! 🎉' : '+ Aportar'}
        </button>
      </div>
    </div>
  );
};

interface GoalsViewProps {
  goals: Goal[];
  contributions: GoalContribution[];
  onAddGoalClick: () => void;
  onAddContributionClick: (goal: Goal) => void;
  onDeleteGoal: (id: number) => void;
  onDeleteContribution: (id: number) => void;
}

const GoalsView: React.FC<GoalsViewProps> = ({ goals, contributions, onAddGoalClick, onAddContributionClick, onDeleteGoal, onDeleteContribution }) => {
    
    const contributionsByGoal = useMemo(() => {
        return contributions.reduce((acc, c) => {
            if (!acc[c.goal_id]) {
                acc[c.goal_id] = [];
            }
            acc[c.goal_id].push(c);
            return acc;
        }, {} as Record<number, GoalContribution[]>);
    }, [contributions]);
    
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Metas de Ahorro</h1>
          <p className="text-text-secondary mt-1">Define tus objetivos y mira cómo tu esfuerzo da frutos.</p>
        </div>
        <button
          onClick={onAddGoalClick}
          className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Crear Meta</span>
        </button>
      </div>

      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => (
            <GoalCard 
                key={goal.id} 
                goal={goal} 
                contributions={contributionsByGoal[goal.id]?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || []}
                onAddContributionClick={onAddContributionClick}
                onDeleteGoal={onDeleteGoal}
                onDeleteContribution={onDeleteContribution}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface border-2 border-dashed border-border rounded-lg">
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-xl font-semibold text-text-primary">Tu primera meta te espera</h2>
          <p className="text-text-secondary mt-2 max-w-md mx-auto">El ahorro es más fácil cuando tienes un objetivo claro. ¡Crea tu primera meta y empieza a construir tus sueños!</p>
          <button onClick={onAddGoalClick} className="mt-6 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-transform duration-300 hover:scale-105">
            Crear mi Primera Meta
          </button>
        </div>
      )}
    </div>
  );
};

export default GoalsView;
