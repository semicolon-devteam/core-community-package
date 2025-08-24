// Mock commentService for Storybook
const commentService = {
  getComments: async (postId, options = {}) => {
    return {
      successOrNot: 'Y',
      data: {
        items: [
          {
            id: 1,
            postId: postId,
            content: '좋은 글이네요!',
            author: '사용자1',
            authorId: '1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            likes: 5
          },
          {
            id: 2,
            postId: postId,
            content: '유용한 정보 감사합니다.',
            author: '사용자2',
            authorId: '2',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString(),
            likes: 3
          }
        ],
        totalCount: 2
      },
      message: 'success'
    };
  },
  
  createComment: async (postId, content) => {
    return {
      successOrNot: 'Y',
      data: {
        id: Date.now(),
        postId: postId,
        content: content,
        author: '현재 사용자',
        authorId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0
      },
      message: 'success'
    };
  }
};

export default commentService;