const express = require('express')
const Footer = require('../Models/Footer')
const router = express.Router()


router.get('/data', async (req, res) => {
    try {
        const footer = await Footer.findOne();  
        if (!footer) {
            res.status(404).json({ message: "Footer Data not found" })
        } else {
            res.status(200).json(footer)
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})


router.post('/', async (req, res) => {
    try {
        const { bottom_ribbon, footer_columns, footer_contacts, footer_socials } = req.body
        const ribbon = new Footer({
            bottom_ribbon, footer_columns, footer_contacts, footer_socials
        })
        await ribbon.save();
        res.status(200).json(bottom_ribbon)
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { bottom_ribbon, footer_columns, footer_contacts, footer_socials } = req.body;

        const updatedFooter = await Footer.findByIdAndUpdate(id, {
            bottom_ribbon,
            footer_columns,
            footer_contacts,
            footer_socials
        }, { new: true });

        if (!updatedFooter) {
            return res.status(404).json({ message: "Footer not found" });
        }

        res.status(200).json(updatedFooter);
    } catch (error) {
        console.error("Error updating footer:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



module.exports = router