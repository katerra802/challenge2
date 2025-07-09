class userOutPutDTO {
    constructor(user) {
        this.userId = user._id;
        this.name = user.username;
        this.email = user.email;
        this.role = user.role;
    }
}

module.exports = userOutPutDTO;