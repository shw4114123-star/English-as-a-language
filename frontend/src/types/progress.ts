export interface UserProgress {
    level: string;
    xp: number;
    completedLessons: string[];
    gameScores: {
        gameName: string;
        score: number;
        date?: string;
    }[];
    placementTestScore?: number;
}
