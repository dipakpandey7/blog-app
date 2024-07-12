import { Request, Response } from 'express';
import Post from '../models/Post';

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, category, featuredImage } = req.body;
    const authorId = req.user.id;

    const post = new Post({
      title,
      content,
      authorId,
      category,
      featuredImage,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, category, featuredImage } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (post.authorId.toString() !== req.user.id) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.featuredImage = featuredImage || post.featuredImage;
    post.lastUpdated = new Date();

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (post.authorId.toString() !== req.user.id) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await post.remove();
    res.json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const searchPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { keyword } = req.query;
    const posts = await Post.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } },
      ],
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};