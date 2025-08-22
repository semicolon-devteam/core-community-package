interface LevelInfo {
    level: number;
    required_points: number;
}
/**
 * 레벨 관련 유틸리티 함수들
 */
export declare class LevelUtil {
    /**
     * 현재 포인트를 기반으로 사용자의 실제 레벨을 계산
     */
    static calculateUserLevel(currentPoints: number, levelTable: LevelInfo[]): number;
    /**
     * 현재 레벨과 다음 레벨 정보를 반환
     */
    static getLevelProgress(currentPoints: number, levelTable: LevelInfo[]): {
        currentLevel: number;
        currentLevelPoints: number;
        nextLevel: number;
        nextLevelPoints: number;
        progressPercentage: number;
        pointsToNext: number;
    };
    /**
     * 다음 레벨 정보를 반환 (간단한 형태)
     */
    static getNextLevelInfo(currentPoints: number, levelTable: LevelInfo[]): {
        nextLevel: number;
        requiredPoint: number;
        levelUpPercentage: number;
        isMaxLevel: boolean;
        levelUpPercent?: undefined;
    } | {
        nextLevel: number;
        requiredPoint: number;
        levelUpPercent: number;
        isMaxLevel: boolean;
        levelUpPercentage?: undefined;
    };
}
export {};
