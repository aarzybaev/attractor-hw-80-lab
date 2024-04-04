import {promises as fs} from 'fs';
import {Item, ItemsApi} from "./types";
import crypto from "crypto";

const filename = './itemDB.json';
let data: ItemsApi[] = [];

const itemFileDb = {
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
    async addItem(newItem: Item) {
        const itemData: ItemsApi = {
            id: crypto.randomUUID(),
            ...newItem,
        };
        data.push(itemData);
        await this.save();
        return ({id: itemData.id, title: itemData.title});
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
    async updateItem(id: string, item: Item) {
        const index = data.findIndex(place => place.id === id);
        if (index === -1) return false;
        data[index] = {id, ...item};
        await this.save();
        return data[index];
    },
    async isExistCategoryID(id: string) {
        return data.find(item => item.categoryID === id);

    },
    async isExistPlaceID(id: string) {
        return data.find(item => item.placeID === id);

    }
};


export default  itemFileDb;