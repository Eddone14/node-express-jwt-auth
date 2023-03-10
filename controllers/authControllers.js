const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle error
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let error = { email: '', password: ''};

    // duplicate error code
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors
if (err.message.incldues('user validation failed')){
    object.values(err.errors).forEach(({properties}) => {
        error[properties.path] = properties.message;
    });
}

    return errors;
}

const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({ id }, 'net ninja secret', {
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({user: user._id});
    }
    catch (err) {
        const error = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        res.status(200).json({ user: user._id})
    }
    catch (err) {
        res.status(400).json({});
    }
}