class productDTO {
    constructor(data) {
        this.name = data.name;
        this.slug = data.slug;
        this.quantity = data.quantity;
    }
}

module.exports = productDTO;