const mockPosts = [
  {
    id: 1,
    username: "admin",
    content: "Đây là bài đăng đầu tiên!",
    timestamp: "2025-04-16",
  },
  {
    id: 2,
    username: "admin",
    content: "Chúc mọi người một ngày tốt lành!",
    timestamp: "2025-04-15",
  },
];
export const createPost = async (postContent) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (postContent) {
        const newPost = {
          id: mockPosts.length + 1,
          username: "admin",
          content: postContent,
          timestamp: new Date().toISOString().split("T")[0],
        };
        mockPosts.push(newPost);
        resolve(newPost);
      } else {
        reject(new Error("Nội dung bài viết không hợp lệ"));
      }
    }, 1000);
  });
};

export const getNewestPosts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPosts);
    }, 1000);
  });
};
