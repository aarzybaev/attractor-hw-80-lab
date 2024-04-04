import express from 'express';
import categoriesRouter from "./routers/categories";
import itemsRouter from "./routers/items";
import placesRouter from "./routers/places";
import categoryFileDb from "./categoryFileDb";
import placeFileDb from "./placeFileDb";
import itemFileDb from "./itemFileDb";

const app = express();
const port = 8000;

app.use(express.static('public'));
app.use(express.json());
app.use('/categories', categoriesRouter);
app.use('/items', itemsRouter);
app.use('/places', placesRouter);

const run = async () => {
    await categoryFileDb.init();
    await placeFileDb.init();
    await itemFileDb.init();

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });
};

run().catch(console.error);