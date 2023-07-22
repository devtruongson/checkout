const bcrypt = require('bcrypt');

const CheckPassword = (password, hash) => {
    const check = bcrypt.compareSync(password, hash); // true

    return check;
};

module.exports = CheckPassword;
