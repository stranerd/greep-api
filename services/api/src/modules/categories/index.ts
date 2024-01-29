import { CategoryRepository } from './data/repositories/categories'
import { CategoryUseCase } from './domain/useCases/category'

const categoryRepository = CategoryRepository.getInstance()
export const CategoryUserCases = new CategoryUseCase(categoryRepository)

