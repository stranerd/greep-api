export interface ICategoryRepository {
	createCategory(category: string): Promise<any | null>
	getAllCategories(): Promise<any[] | null>
	// get(category: string): Promise<any | null>
}
