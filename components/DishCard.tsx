
import React from 'react';
import { Dish, AestheticStyle } from '../types';

interface DishCardProps {
  dish: Dish;
  onRegenerate: (dishId: string) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onRegenerate }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col transition-all hover:shadow-md">
      <div className="aspect-square w-full bg-stone-100 relative group">
        {dish.status === 'generating' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-stone-50/80 backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-medium text-stone-500 uppercase tracking-widest">Photographing...</p>
          </div>
        ) : dish.imageUrl ? (
          <img 
            src={dish.imageUrl} 
            alt={dish.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-300">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {dish.status === 'completed' && (
          <button 
            onClick={() => onRegenerate(dish.id)}
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            title="Retake photo"
          >
            <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-stone-800 mb-1">{dish.name}</h3>
        <p className="text-sm text-stone-500 line-clamp-3 leading-relaxed flex-1 italic">
          "{dish.description}"
        </p>
      </div>
    </div>
  );
};
