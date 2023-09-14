const router = require('express').Router();
const { User, Blog, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Get all posts
router.get('/', async (req, res) => {
    try {
        const blogData = await Blog.findAll({ include: [{ model: Comment }] });

        res.status(200).json(blogData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get a post by ID
router.get('/:id', async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {
            include: [{ model: User, Comment }]
        });

        if (!blogData) {
            res.status(404).json({ message: 'No post with this ID' });
            return;
        }

        res.status(200).json(blogData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Create new blog post
router.post('/', withAuth, async (req, res) => {
    try {
        const newBlog = await Blog.create({
            ...req.body,
            user_id: req.session.user_id
        });

        res.status(200).json(newBlog);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Update this user's post by ID
router.put('/:id', withAuth, async (req, res) => {
    try {
        const blogData = await Blog.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        });

        if (!blogData) {
            res.status(404).json({ message: 'No post with this ID' });
            return;
        }

        res.status(200).json(blogData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete this user's post by ID
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const blogData = await Blog.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        });

        if (!blogData) {
            res.status(404).json({ message: 'No post with this ID'});
            return;
        }

        res.status(200).json(blogData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;