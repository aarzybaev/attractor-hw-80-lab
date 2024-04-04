import express from "express";
import {Place} from "../types";
import placeFileDb from "../placeFileDb";

const placesRouter = express.Router();
placesRouter.get('/', async (req, res) => {
    try {
        const places = await placeFileDb.getItems();
        return res.json(places);
    } catch (e) {
        console.error(e);
    }
});

placesRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const place = await placeFileDb.getItemById(id);
        if (!place) {
            return res.status(404).json({error: 'Not found'});
        }
        return res.send(place);
    } catch (e) {
        console.error(e);
    }
});

placesRouter.post('/', async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;

    if (title === undefined || (/^\s*$/.test(title)) || description === undefined) {
        return res.status(404).json({"error": "title and description must be present in the request"});
    }

    const place: Place = {
        title,
        description
    };

    try {
        const savedItem = await placeFileDb.addItem(place);
        return res.send(savedItem);
    } catch (e) {
        console.error(e);
    }
});

placesRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const isExistID = await placeFileDb.isExistID(id);

        if (isExistID) {
            return res.status(404).json({"error": "delete is restricted"});
        }
        const status = await placeFileDb.removeItem(id);
        return status ? res.json({"message": "success"}) : res.status(404).json({"error": "Not found"});
    } catch (e) {
        console.error(e);
    }
});

placesRouter.put('/:id', async (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const description = req.body.description;

    if (title === undefined || (/^\s*$/.test(title)) || description === undefined) {
        return res.status(404).json({"error": "title and description must be present in the request"});
    }

    const place: Place = {
        title,
        description
    };

    try {
        const response = await placeFileDb.updateItem(id, {title, description});
        return response ? res.json(response) : res.status(404).json({"error": "Not found"});
    } catch (e) {
        console.error(e);
    }
});

export default placesRouter;