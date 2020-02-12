export type Stats = {
    wonLast: boolean;
    streak: number;
    longestStreak: number;
    matches: number;
    wins: number;
    losses: number;
    score: number;
    win_percent: number;
    loss_percent: number;
    win_ratio: number;
};

export const getInitialStats = (win: boolean) => {
    const wins = win ? 1 : 0;
    const losses = win ? 0 : 1;
    const matches = 1;

    return {
        wonLast: win,
        streak: win ? 1 : 0,
        longestStreak: win ? 1 : 0,
        matches,
        wins,
        losses,

        // Calculated scores
        score: wins - losses,
        win_percent: Math.round((wins / matches) * 100),
        loss_percent: Math.round((losses / matches) * 100),
        win_ratio: Math.round((wins / (losses || 1)) * 100) / 100,
    };
};

export const getUpdatedStats = (prevStats: Stats, win: boolean) => {
    let { wins, losses, matches, streak, longestStreak } = prevStats;
    const { wonLast } = prevStats;

    matches++;

    if (win) {
        wins++;

        if (wonLast) {
            streak++;
        } else {
            streak = 1;
        }
    } else {
        streak = 0;
        losses++;
    }

    // Keep track of longest streak (never resets);
    if (streak >= longestStreak) {
        longestStreak = streak;
    }

    return {
        wonLast: win,
        streak,
        longestStreak,
        matches,
        wins,
        losses,

        // Calculated scores
        score: wins - losses,
        win_percent: Math.round((wins / matches) * 100),
        loss_percent: Math.round((losses / matches) * 100),
        win_ratio: Math.round((wins / (losses || 1)) * 100) / 100,
    };
};
