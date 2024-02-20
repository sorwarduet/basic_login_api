const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
        name: {type: String, required: true},
        email:
            {
                type: String,
                required: [true, 'Please enter a valid email address.'],
                unique: true,
                validate: {
                    validator: function (value) {
                        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    },
                    message: 'Invalid email address',
                }
            },
        password: {type: String, required: [true, 'Please enter a password.']},

    },
    {
        timestamps: true, versionKey: false
    }
)

const User = mongoose.model('User', userSchema);
module.exports = User;