// Mock pointService for Storybook
const pointService = {
  getUserPoint: async (userId) => {
    return {
      successOrNot: 'Y',
      data: 1250,
      message: 'success'
    };
  },
  
  getUserPointHistory: async (userId) => {
    return {
      successOrNot: 'Y',
      data: {
        items: [
          {
            id: 1,
            type: 'earn',
            amount: 100,
            description: '게시글 작성',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            type: 'spend',
            amount: -50,
            description: '파일 다운로드',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ],
        totalCount: 2
      },
      message: 'success'
    };
  }
};

export default pointService;