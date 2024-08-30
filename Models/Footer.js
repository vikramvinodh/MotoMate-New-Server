const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const footerSchema = new Schema({
    footer_columns: {
        type: [Schema.Types.Mixed]
    },
    footer_socials: {
        type: [Schema.Types.Mixed]
    },
    footer_contacts: {
        type: [Schema.Types.Mixed]
    },
    bottom_ribbon: String,
})

const Footer = mongoose.model("Footer", footerSchema);

module.exports = Footer;