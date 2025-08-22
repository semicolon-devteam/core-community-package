export enum BoardType {
  HOME = 10,
  PARTNER = 20,
  SPORTS = 30,
  VR = 40,
  OPEN_LOUNGE = 50,
  CLOSE_LOUNGE = 60,
  POINT_SHOP = 70,
  CUSTOMER = 80,
}

export enum SportsType {
  ALL = BoardType.SPORTS, // 모든 스포츠 (부모 카테고리와 같은 ID)
  FOOTBALL = 31,
  BASEBALL = 32,
  BASKETBALL = 33,
  VOLLEYBALL = 34,
}

export enum OpenLoungeType {
  ALL = BoardType.OPEN_LOUNGE, // 모든 오픈 라운지 (부모 카테고리와 같은 ID)
  FREE = 51,
  HUMOR = 52,
  CHALLENGE = 53,
  SOCIAL = 54,
  BROADCAST = 55,
  ANALYTICS = 56,
}

export enum CloseLoungeType {
  ALL = BoardType.CLOSE_LOUNGE, // 모든 클로즈 라운지 (부모 카테고리와 같은 ID)
  BRONZE = 61,
  SILVER = 62,
  GOLD = 63,
}

export enum CustomerType {
  ALL = BoardType.CUSTOMER, // 모든 고객 센터 (부모 카테고리와 같은 ID)
  QNA = 81,
  NOTICE = 82,
}

// URL 패턴 매핑
export const URL_TO_BOARD_ID: Record<string, number> = {
  // Home
  // home: BoardType.HOME,

  // Partner
  // partners: BoardType.PARTNER,

  // Sports
  sports: BoardType.SPORTS,
  "sports/all": SportsType.ALL,
  "sports/football": SportsType.FOOTBALL,
  "sports/baseball": SportsType.BASEBALL,
  "sports/basketball": SportsType.BASKETBALL,
  "sports/volleyball": SportsType.VOLLEYBALL,

  // VR
  vr: BoardType.VR,

  // Open Lounge
  "open-lounge": BoardType.OPEN_LOUNGE,
  "open-lounge/free": OpenLoungeType.FREE,
  "open-lounge/humor": OpenLoungeType.HUMOR,
  "open-lounge/challenge": OpenLoungeType.CHALLENGE,
  "open-lounge/social": OpenLoungeType.SOCIAL,
  "open-lounge/broadcast": OpenLoungeType.BROADCAST,
  "open-lounge/analytics": OpenLoungeType.ANALYTICS,

  // Close Lounge
  "close-lounge": BoardType.CLOSE_LOUNGE,
  "close-lounge/bronze": CloseLoungeType.BRONZE,
  "close-lounge/silver": CloseLoungeType.SILVER,
  "close-lounge/gold": CloseLoungeType.GOLD,

  // Point Shop
  "point-shop": BoardType.POINT_SHOP,

  // Customer
  customer: BoardType.CUSTOMER,
  "customer/qna": CustomerType.QNA,
  "customer/notice": CustomerType.NOTICE,
};

export const BOARD_ID_TO_URL: Record<number, string> = Object.entries(
  URL_TO_BOARD_ID
).reduce(
  (acc, [url, id]) => ({
    ...acc,
    [id]: url,
  }),
  {}
);
