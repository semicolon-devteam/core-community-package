// formatDate와 timeAgo 함수를 서버와 클라이언트 모두에서 사용할 수 있게 설정

export function formatDate(dateString: string, isSimple = false): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  // 날짜가 유효하지 않은 경우
  if (isNaN(date.getTime())) {
    return dateString;
  }

  // 날짜를 YYYY.MM.DD. HH:MM:SS 형식으로 포맷팅
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return isSimple
    ? `${year}.${month}.${day}`
    : `${year}.${month}.${day}. ${hours}:${minutes}:${seconds}`;
}

export function timeAgo(dateString: string, isSimple: boolean = true): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  // 날짜가 유효하지 않은 경우
  if (isNaN(date.getTime())) {
    return dateString;
  }

  // 서버 측 렌더링 시 포맷된 날짜 반환
  // if (typeof window === "undefined") {
  //   // 서버에서는 정적인 포맷으로 반환
  //   return formatDate(dateString);
  // }

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // 1분 미만
  if (seconds < 60) {
    return "방금 전";
  }

  // 1시간 미만
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}분 전`;
  }

  // 24시간 미만
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}시간 전`;
  }

  return isSimple ? DateUtil.toChar(dateString, "MM.dd") : DateUtil.toChar(dateString, "yyyy.MM.dd. HH:mm:ss");

  // // 30일 미만
  // const days = Math.floor(hours / 24);
  // if (days < 30) {
  //   return `${days}일 전`;
  // }

  // // 12개월 미만
  // const months = Math.floor(days / 30);
  // if (months < 12) {
  //   return `${months}개월 전`;
  // }

  // // 1년 이상
  // const years = Math.floor(months / 12);
  // return `${years}년 전`;
}

export const DateUtil = {
  toChar(
    input: string | Date,
    format: string = "YYYY.MM.DD. HH:MM:SS"
  ): string {
    const date = typeof input === "string" ? new Date(input) : input;

    if (!date || isNaN(date.getTime())) return "";

    const map: Record<string, string> = {
      yyyy: String(date.getFullYear()),
      MM: String(date.getMonth() + 1).padStart(2, "0"),
      dd: String(date.getDate()).padStart(2, "0"),
      HH: String(date.getHours()).padStart(2, "0"),
      mm: String(date.getMinutes()).padStart(2, "0"),
      ss: String(date.getSeconds()).padStart(2, "0"),
    };

    return Object.entries(map).reduce(
      (result, [key, value]) => result.replace(key, value),
      format
    );
  },
};
