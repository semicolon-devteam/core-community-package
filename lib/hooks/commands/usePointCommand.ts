import pointService from "@services/pointService";

export const usePointCommand = () => {
    const addPoint = async (userId: number, point: number, reason: string) => {
        const response = await pointService.addPoint(point, reason, userId);
        return response;
    };
    const subtractPoint = async (userId: number, point: number, reason: string) => {
        const response = await pointService.subtractPoint(point, reason, userId);
        return response;
    };

    return {
        addPoint,
        subtractPoint,
    };
}