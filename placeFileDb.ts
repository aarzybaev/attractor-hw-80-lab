import { promises as fs } from 'fs';
import {PlacesApi, Place} from "./types";
import crypto from "crypto";
import itemFileDb from "./itemFileDb";

const filename = './placeDB.json';
let data: PlacesApi[] = [];

const placeFileDb = {
    async init() {
        try {
            const fileContents = await fs.readFile(filename);
            data = JSON.parse(fileContents.toString());
        } catch (e) {
            data = [];
        }
    },
    async getItems() {
        return data;
    },
    async getItemById(id: string) {
        return data.find(item => item.id === id);
    },
    async addItem(item: Place) {
        const place: PlacesApi = {
            id: crypto.randomUUID(),
            ...item,
        };
        data.push(place);
        await this.save();
        return ({id: place.id, title: place.title});
    },
    async save() {
        return fs.writeFile(filename, JSON.stringify(data,null, 2));
    },
    async removeItem(id: string) {
        const index = data.findIndex(item => item.id === id);
        if (index === -1) return false;
        data.splice(index, 1);
        await this.save();
        return true;
    },
    async updateItem(id: string, item: Place) {
        const index = data.findIndex(place => place.id === id);
        if (index === -1) return false;
        data[index] = {id, ...item};
        await this.save();
        return data[index];
    },
    async isExistID(id: string) {
        return itemFileDb.isExistPlaceID(id);
    }
};

export default placeFileDb;