declare module 'msforum-grpc' {
  export interface IForumClient {
    ping: (
      payload: unknown,
    ) => IPing_Response;

    listMainCategories: (
      payload: unknown,
    ) => Promise<IListMainCategories_Response>;

    // listCategories: (
    //   payload: IListCategories_Request,
    // ) => Promise<IListCategories_Response>;

    getCategory: (
      payload: IGetCategory_Request,
    ) => Promise<IGetCategory_Response>;

    listPosts: (payload: IListPosts_Request) => Promise<IListPosts_Response>;

    getPost: (payload: IGetPost_Request) => Promise<IGetPost_Response>;

    createPost: (payload: ICreatePost_Request) => Promise<ICreatePost_Response>;

    createPostComment: (
      payload: ICreatePostComment_Request,
    ) => Promise<ICreatePostComment_Response>;

    createPostReaction: (
      payload: ICreatePostReaction_Request,
    ) => Promise<ICreatePostReaction_Response>;

    updatePost: (payload: IUpdatePost_Request) => Promise<IUpdatePost_Response>;
  }

  export type IListMainCategories_Response = ICategoryList;
  // export type IListCategories_Response = ICategoryList;
  export type IGetCategory_Response = ICategoryFullData;
  export type IListPosts_Response = IPostList;
  export type IGetPost_Response = IPostFullData;
  export type ICreatePost_Response = IPost;
  export type ICreatePostComment_Response = IPostComment;
  export type ICreatePostReaction_Response = IPostReaction;
  export type IUpdatePost_Response = IPost;

  export interface IPing_Response {
    ping: 'pong';
  }

  // -----------------------------
  // Post

  export interface IListPosts_Request {
    categoryId: string;
  }

  export interface IGetPost_Request {
    postId: string;
  }

  export type IPostType = 'post' | 'adm-info';
  export type IPostState = 'open' | 'closed';

  export interface ICreatePost_Request {
    categoryId: string;
    createdBy: string;
    title: string;
    excerpt: string;
    content: string;
  }

  export interface IUpdatePost_Request {
    id: string;
    createdBy: string;
    title?: string;
    excerpt?: string;
    postType?: IPostType;
    postState?: IPostState;
    content?: string;
  }

  export interface ICreatePostComment_Request {
    postId: string;
    parentId: string;
    createdBy: string;
    content: string;
  }

  export interface ICreatePostReaction_Request {
    postId: string;
    commentId: string;
    createdBy: string;
    reactType: string;
  }

  export interface IPostList {
    posts: IPost[];
  }

  export interface IPostFullData {
    post: IPost;
    comments: IPostComment[];
    reactions: IPostReaction[];
    category: ICategory;
  }

  export interface IPost {
    id: string;
    categoryId: string;
    createdBy: string;
    createdAt: string;
    commentsCount: number;
    title: string;
    excerpt: string;
    postType: IPostType;
    postState: IPostState;
    updatedAt?: string;
    content: string;
  }

  export interface IPostComment {
    id: string;
    postId: string;
    parentId: string;
    createdBy: string;
    createdAt: string;
    content: string;
  }

  export interface IPostReaction {
    id: string;
    postId: string;
    commentId: string;
    createdBy: string;
    createdAt: string;
    reactType: string;
  }

  // -----------------------------
  // Category

  export interface ICategoryList {
    categories: ICategory[];
  }

  // export interface IListCategories_Request {
  //   parentId: string;
  // }

  export interface IGetCategory_Request {
    categoryId: string;
  }

  export interface ICategoryFullData {
    category: ICategory;
    subcategories: ICategory[];
    posts: IPost[];
  }

  export interface ICategory {
    id: string;
    parentId?: string;
    title: string;
    description: string;
    createdAt: string;
    postsCount: number;
  }
}
