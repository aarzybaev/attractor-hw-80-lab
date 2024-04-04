import express from "express";
import {imagesUpload} from "../multer";
import itemFileDb from "../itemFileDb";
import {Item} from "../types";

const itemsRouter = express.Router();
itemsRouter.get('/', async (req, res) => {
    try {
        const items = await itemFileDb.getItems();
        return res.json(items);
    } catch (e) {
        console.error(e);
    }
});

itemsRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const item = await itemFileDb.getItemById(id);
        if (!item) {
            return res.status(404).json({error: 'Not found'});
        }
        return res.send(item);
    } catch (e) {
        console.error(e);
    }
});

itemsRouter.post('/', imagesUpload.single('image'), async (req, res) => {
    const categoryID = req.body.categoryID;
    const placeID = req.body.placeID;
    const title = req.body.title;
    const description = req.body.description;

    if (
        categoryID == undefined ||
        (/^\s*$/.test(categoryID)) ||
        placeID == undefined ||
        (/^\s*$/.test(placeID)) ||
        title === undefined ||
        (/^\s*$/.test(title)) ||
        description === undefined) {
        return res.status(404).json({"error": "Some fields must be present in the request"});
    }

    const item: Item = {
        categoryID,
        placeID,
        title,
        description,
        image: req.file ? req.file.filename : null,
    };

    try {
        const savedItem = await itemFileDb.addItem(item);
        return res.send(savedItem);
    } catch (e) {
        console.error(e);
    }
});

itemsRouter.delete('/:id', async (req, res) => {

    try {
        const id = req.params.id;
        const status = await itemFileDb.removeItem(id);
        return status ? res.json({"message": "success"}) : res.status(404).json({"error": "Not found"});
    } catch (e) {
        console.error(e);
    }
});

itemsRouter.put('/:id', async (req, res) => {
    const id = req.params.id;
    const categoryID = req.body.categoryID;
    const placeID = req.body.placeID;
    const title = req.body.title;
    const description = req.body.description;

    if (
        categoryID == undefined ||
        (/^\s*$/.test(categoryID)) ||
        placeID == undefined ||
        (/^\s*$/.test(placeID)) ||
        title === undefined ||
        (/^\s*$/.test(title)) ||
        description === undefined) {
        return res.status(404).json({"error": "Some fields must be present in the request"});
    }

    const item: Item = {
        categoryID,
        placeID,
        title,
        description,
        image: req.file ? req.file.filename : null,
    };

    try {
        const response = await itemFileDb.updateItem(id, item);
        return response ? res.json(response) : res.status(404).json({"error": "Not found"});
    } catch (e) {
        console.error(e);
    }
});

export default itemsRouter;