import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';

const userRegistrationValidation = [
    body('name')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 100 })
        .withMessage('Name cannot exceed 100 characters'),
    body('email')
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .isLength({ max: 100 })
        .withMessage('Email cannot exceed 100 characters'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 7, max: 255 })
        .withMessage('Password must be between 7 and 255 characters')
];

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const showLoginForm = (req, res) => {
    if (req.query.loggedOut === 'true') {
        req.flash('success', 'You have logged out successfully.');
    }

    res.render('login', { title: 'Login' });
};

const processUserRegistrationForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/register');
    }

    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        if (error.code === '23505') {
            req.flash('error', 'An account with that email already exists.');
        } else {
            console.error('Error registering user:', error);
            req.flash('error', 'An error occurred during registration. Please try again.');
        }

        res.redirect('/register');
    }
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;
    const user = await authenticateUser(email, password);

    if (!user) {
        req.flash('error', 'Login failed. Please check your email and password.');
        return res.redirect('/login');
    }

    req.session.user = user;
    req.flash('success', 'Login successful!');
    console.log('Logged in user:', user);
    res.redirect('/dashboard');
};

const processLogout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Error logging out:', error);
            return res.redirect('/');
        }

        res.redirect('/login?loggedOut=true');
    });
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }

    next();
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/dashboard');
        }

        next();
    };
};

const showDashboard = (req, res) => {
    const user = req.session.user;

    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

const showUsersPage = async (req, res) => {
    const users = await getAllUsers();

    res.render('users', {
        title: 'Users',
        users
    });
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    userRegistrationValidation,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
};
