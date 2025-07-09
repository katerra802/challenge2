class productDTO {
    constructor(data) {
        this._id = data._id;
        this.name = data.name;
        this.slug = data.slug;
        this.quantity = data.quantity;
    }
}

module.exports = productDTO;