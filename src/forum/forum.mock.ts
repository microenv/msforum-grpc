import { IListMainCategories_Response, IPostList } from 'msforum-grpc';

export const categoryList: IListMainCategories_Response = {
  categories: [
    {
      id: '1',
      title: 'Category 1 title',
      description: 'Category 1 description',
      postsCount: 101,
      createdAt: new Date().toISOString(),
      parentId: null,
    },
    {
      id: '2',
      title: 'Category 2 title',
      description: 'Category 2 description',
      postsCount: 102,
      createdAt: new Date().toISOString(),
      parentId: null,
    },
    {
      id: '3',
      title: 'Category 3 title',
      description: 'Category 3 description',
      postsCount: 103,
      createdAt: new Date().toISOString(),
      parentId: null,
    },
    {
      id: '4',
      title: 'Sub-Category #1',
      description: 'This category is inside Category 1',
      postsCount: 2,
      createdAt: new Date().toISOString(),
      parentId: '1',
    },
  ],
};

export const postList: IPostList = {
  posts: [
    {
      id: '1',
      categoryId: '1',
      createdBy: 'user1',
      createdAt: new Date().toISOString(),
      commentsCount: 3,
      title: 'Post 1',
      excerpt: 'Excerpt from the post',
      postType: 'post',
      postState: 'open',
      updatedAt: null,
      content: 'Full content of the post',
    },
    {
      id: '2',
      categoryId: '1',
      createdBy: 'user1',
      createdAt: new Date().toISOString(),
      commentsCount: 3,
      title: 'Post 2',
      excerpt: 'Excerpt from the post',
      postType: 'post',
      postState: 'open',
      updatedAt: null,
      content: 'Full content of the post',
    },
    {
      id: '3',
      categoryId: '2',
      createdBy: 'user1',
      createdAt: new Date().toISOString(),
      commentsCount: 3,
      title: 'Post 3',
      excerpt: 'Excerpt from the post',
      postType: 'post',
      postState: 'open',
      updatedAt: null,
      content: 'Full content of the post',
    },
  ],
};
