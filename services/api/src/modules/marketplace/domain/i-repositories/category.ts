
export interface ICategoryRepository {
    createCategory(category: string): Promise<any | null>
    getAllCategories(): Promise<any[] | null>
}