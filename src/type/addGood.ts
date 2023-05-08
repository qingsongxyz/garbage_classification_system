interface StorageForm {
    storage: number
}

interface GoodForm {
    name: string,
    categoryId: number,
    image: string,
    score: number,
    storage: StorageForm
}

export { 
    StorageForm,
    GoodForm
};