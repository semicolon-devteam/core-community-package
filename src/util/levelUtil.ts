import type { LevelInfo } from "@model/common";

/**
 * 레벨 관련 유틸리티 함수들
 */
export class LevelUtil {
  /**
   * 현재 포인트를 기반으로 사용자의 실제 레벨을 계산
   */
  static calculateUserLevel(currentPoints: number, levelTable: LevelInfo[]): number {
    if (!levelTable.length) return 0;
    
    // 레벨표를 오름차순으로 정렬
    const sortedLevels = [...levelTable].sort((a, b) => a.level - b.level);
    
    let userLevel = 0;
    for (const level of sortedLevels) {
      if (currentPoints >= level.required_points) {
        userLevel = level.level;
      } else {
        break;
      }
    }
    
    return userLevel;
  }

  /**
   * 현재 레벨과 다음 레벨 정보를 반환
   */
  static getLevelProgress(currentPoints: number, levelTable: LevelInfo[]) {
    
    if (!levelTable.length) {
      return {
        currentLevel: 0,
        currentLevelPoints: 0,
        nextLevel: 1,
        nextLevelPoints: 0,
        progressPercentage: 0,
        pointsToNext: 0,
      };
    }

    const sortedLevels = [...levelTable].sort((a, b) => a.level - b.level);
    const userLevel = this.calculateUserLevel(currentPoints, levelTable);
    
    // 현재 레벨 정보 찾기
    const currentLevelInfo = sortedLevels.find(level => level.level === userLevel);
    const currentLevelPoints = currentLevelInfo?.required_points || 0;
    
    // 다음 레벨 정보 찾기
    const nextLevelInfo = sortedLevels.find(level => level.level === userLevel + 1);
    const nextLevel = nextLevelInfo?.level || userLevel;
    const nextLevelPoints = nextLevelInfo?.required_points || currentLevelPoints;
    
    // 진행률 계산
    let progressPercentage = 0;
    let pointsToNext = 0;
    
    if (nextLevelInfo) {
      // 현재 레벨에서 다음 레벨까지 필요한 포인트
      const pointsNeededForNext = nextLevelPoints - currentLevelPoints;
      // 현재 레벨을 넘어선 포인트
      const pointsEarnedInCurrentLevel = currentPoints - currentLevelPoints;
      
      progressPercentage = pointsNeededForNext > 0 
        ? Math.min(100, (pointsEarnedInCurrentLevel / pointsNeededForNext) * 100)
        : 100;
      
      pointsToNext = Math.max(0, nextLevelPoints - currentPoints);
    } else {
      // 최고 레벨에 도달한 경우
      progressPercentage = 100;
      pointsToNext = 0;
    }

    return {
      currentLevel: userLevel,
      currentLevelPoints,
      nextLevel,
      nextLevelPoints,
      progressPercentage: Math.round(progressPercentage),
      pointsToNext,
    };
  }
  /**
   * 다음 레벨 정보를 반환 (간단한 형태)
   */
  static getNextLevelInfo(currentPoints: number, levelTable: LevelInfo[]) {
    if (!levelTable.length) {
      return {
        nextLevel: 1,
        requiredPoint: 0,
        levelUpPercentage: 0,
        isMaxLevel: true,
      };
    }
    

    const sortedLevels = [...levelTable].sort((a, b) => a.level - b.level);
    const userLevel = this.calculateUserLevel(currentPoints, levelTable);
    
    // 현재 레벨 정보 찾기
    const currentLevelInfo = sortedLevels.find(level => level.level === userLevel);
    const currentLevelPoints = currentLevelInfo?.required_points || 0;
    
    // 다음 레벨 정보 찾기
    const nextLevelInfo = sortedLevels.find(level => level.level === userLevel + 1);
    
    if (!nextLevelInfo) {
      // 최고 레벨에 도달한 경우
      return {
        nextLevel: userLevel,
        requiredPoint: 0,
        levelUpPercent: 100,
        isMaxLevel: true,
      };
    }
    
    const nextLevel = nextLevelInfo.level;
    const nextLevelPoints = nextLevelInfo.required_points;
    
    // 다음 레벨까지 필요한 포인트
    const requiredPoint = Math.max(0, nextLevelPoints - currentPoints);
    
    // 현재 레벨에서 다음 레벨까지의 진행률 계산
    const pointsNeededForNext = nextLevelPoints - currentLevelPoints;
    const pointsEarnedInCurrentLevel = currentPoints - currentLevelPoints;
    
    const levelUpPercent = pointsNeededForNext > 0 
      ? Math.min(100, Math.round((pointsEarnedInCurrentLevel / pointsNeededForNext) * 100))
      : 100;

    return {
      nextLevel,
      requiredPoint,
      levelUpPercent,
      isMaxLevel: false,
    };
  }

}