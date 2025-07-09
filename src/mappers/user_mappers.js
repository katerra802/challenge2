const UserOutputDTO = require('../DTO/output/userDTO');

const userMapper = {
    toOutputDTO: (user) => {
        if (!user) {
            return null;
        }
        return new UserOutputDTO(user);
    },

    toOutputListDTO: (users) => {
        if (!users || users.length === 0) {
            return [];
        }
        return users.map(user => new UserOutputDTO(user));
    }
}

module.exports = userMapper;