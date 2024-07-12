import express from 'express';
import { createPost, getPosts, getPostById, updatePost, deletePost, searchPosts } from '../controllers/postController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, createPost);
router.get('/', getPosts);
router.get('/search', searchPosts);
router.get('/:id', getPostById);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

export default router;