const router = require('express').Router();
const { User, Blog, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Get all comments
router.get('/', async (req, res) => {
    try {
        const commentData = await Comment.findAll({ include: [{ model: Blog}] });

        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Create a comment
router.post('/', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.create({
            ...req.body,
            user_id: req.session.user_id
        });

        res.status(200).json(commentData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Update a comment by ID
router.put('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        });

        if (!commentData) {
            res.status(404).json({ message: 'No comment with this ID' });
            return;
        }

        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete a comment
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        });

        if (!commentData) {
            res.status(404).json({ message: 'No comment with this ID' });
            return;
        }

        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
