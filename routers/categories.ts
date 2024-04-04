import express from "express";
import {Category} from "../types";
import categoryFileDb from "../categoryFileDb";

const categoriesRouter = express.Router();
categoriesRouter.get('/', async (req, res) => {
    try {
        const categories = await categoryFileDb.getItems();
        return res.json(categories);
    } catch (e) {
        console.error(e);
    }
});
categoriesRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const category = await categoryFileDb.getItemById(id);
        if (!category) {
            return res.status(404).json({error: 'Not found'});
        }
        return res.send(category);
    } catch (e) {
        console.error(e);
    }
});
categoriesRouter.post('/', async (req, res) => {
    const title = req.body.title;
    const description = req.body.description

    if (title === undefined || (/^\s*$/.test(title)) || description === undefined) {
        return res.status(404).json({"error": "title and description must be present in the request"});
    }

    const category: Category = {
        title,
        description
    };

    try {
        const savedItem = await categoryFileDb.addItem(category);
        return res.send(savedItem);
    } catch (e) {
        console.error(e);
    }

});

categoriesRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const isExistID = await categoryFileDb.isExistID(id);

        if (isExistID) {
            return res.status(404).json({"error": "delete is restricted"});
        }
        const status = await categoryFileDb.removeItem(id);
        return status ? res.json({"message": "success"}) : res.status(404).json({"error": "Not found"});
    } catch (e) {
        console.error(e);
    }
});

categoriesRouter.put('/:id', async (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const description = req.body.description;

    if (title === undefined || (/^\s*$/.test(title)) || description === undefined) {
        return res.status(404).json({"error": "title and description must be present in the request"});
    }

    const place: Category = {
        title,
        description
    };

    try {
        const response = await categoryFileDb.updateItem(id, {title, description});
        return response ? res.json(response) : res.status(404).json({"error": "Not found"});
    } catch (e) {
        console.error(e);
    }
});

export default categoriesRouter;