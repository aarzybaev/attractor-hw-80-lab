
export interface Category {
    title: string;
    description: string;
}

export interface CategoriesApi extends Category {
    id: string;
}

export interface Place {
    title: string;
    description: string;
}

export interface PlacesApi extends Place {
    id: string;
}

export interface Item {
    categoryID: string;
    placeID: string;
    title: string;
    description: string;
    image: string | null;
}

export interface ItemsApi extends Item {
    id: string;
}

export interface Data {
    categories: CategoriesApi[];
    places: PlacesApi[];
    items: ItemsApi[];
}

export interface ItemKeys {
    categoryID: string;
    placeID: string;
}