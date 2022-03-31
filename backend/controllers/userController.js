import asyncHanler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc Auth user & get token
// @route POST /api/users/login 
// @access Public

const authUser = asyncHanler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),

        })

    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});


// @desc Register a new user
// @route POST /api/users 
// @access Public

const registerUser = asyncHanler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
        res.status(400);
        throw new Error("User already exist")
    }
    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(400);
        throw new Error("invalid user data")
    }

});




// @desc Get user profile
// @route GET /api/users/profile 
// @access Private

const getUserProfile = asyncHanler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404);
        throw new Error("user not found")
    }
});


// @desc Update user profile
// @route PUT /api/users/profile 
// @access Private

const updateUserProfile = asyncHanler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {

            user.password = req.body.password;
        }
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),

        })


    } else {
        res.status(404);
        throw new Error("user not found")
    }
});



// @desc Get all users
// @route GET /api/users/
// @access Private/Admin

const getUsers = asyncHanler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin

const deleteUser = asyncHanler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await user.remove();
        res.json({ message: "User deleted.." })

    } else {
        res.status(404);
        throw new Error("User not found")
    }
    res.json(users);
});


// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/Admin

const getUserById = asyncHanler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found...");
    }
});

// @desc Update user
// @route PUT /api/users/:id
// @access Private

const updateUser = asyncHanler(async (req, res) => {

    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        //user.isAdmin = req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin;

        user.isAdmin = req.body.isAdmin ?? user.isAdmin

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,

        })


    } else {
        res.status(404);
        throw new Error("user not found")
    }
});



export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
}