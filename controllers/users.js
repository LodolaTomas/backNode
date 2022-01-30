const bcrypt = require('bcrypt');

const usersRouter = require('express').Router();
const User = require('../models/User');

usersRouter.get('/', async (req, res) => {
    const users= await User.find({}).populate('notes',{
        content: 1,
        date: 1,
    })
    res.json(users)
});

usersRouter.post('/', async (req, res, next) => {
    try {
        const { body } = req;
        const { username, name, password } = body;

        /* 1° password , 2° la complejidad algoritmica en la que quiero hashear, si pongo mas mas tarda en hacerse pero es mas segura */
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = new User({ username, name, passwordHash });
        const savedUser = await user.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json(error);
    }

});

module.exports = usersRouter;