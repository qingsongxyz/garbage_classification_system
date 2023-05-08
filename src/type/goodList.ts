import { StorageForm } from "./addGood";
import GoodCategory from "./goodCategoryList";

interface Good{
    id: number,
    name: string,
    categoryId: number,
    image: string | string[],
    score: number,
    goodCategoryVO?: GoodCategory
    storage: StorageForm
}

export {
    Good
}