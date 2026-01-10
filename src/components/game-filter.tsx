'use client';

import { GameName, GAMES, GAME_COLORS } from '@/lib/types';

interface GameFilterProps {
    selectedGame: GameName | null;
    onGameSelect: (game: GameName | null) => void;
}

export function GameFilter({ selectedGame, onGameSelect }: GameFilterProps) {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => onGameSelect(null)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${selectedGame === null
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                        : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border border-slate-700/50'
                    }`}
            >
                All Games
            </button>

            {GAMES.map((game) => {
                const colors = GAME_COLORS[game];
                const isSelected = selectedGame === game;

                return (
                    <button
                        key={game}
                        onClick={() => onGameSelect(game)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border ${isSelected
                                ? `${colors.bg} ${colors.text} ${colors.border} shadow-lg`
                                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border-slate-700/50'
                            }`}
                    >
                        {game}
                    </button>
                );
            })}
        </div>
    );
}
