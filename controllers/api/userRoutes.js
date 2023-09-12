const router = require('express').Router();
const { User, Blog, Comment } = require('../../models');

// Get all users
router.get('/', async (req, res) => {
    try {
        const userData = await User.findAll({ include: [{ model: Blog, Comment }] });

        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    try {
        const userData = await User.findByPk(req.params.id, { 
            include: [{ model: Blog, Comment }] 
        });

        if (!userData) {
            res.status(404).json({ message: 'No user with this ID!' });
            return;
        }

        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get logged in user
router.get('/loggedin', async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            include: [{ model: Blog, Comment }]
        });

        if (!userData) {
            res.status(404).json({ message: 'No user with this ID!' });
            return;
        }

        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Create user
router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.sessionStore.user_id = userData.id;
            req.session.logged_in = true;

            res.status(201).json(userData);
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.email }});

        if (!userData) {
            res.status(400).json({ message: 'Incorrect email or password, try again' });
            return;
        }

        const validPassword = userData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password, try again' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'Logged in successfully' });
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// User logout
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;
