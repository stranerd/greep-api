import { CommentRepository } from './data/repositories/comments'
import { LikeRepository } from './data/repositories/likes'
import { MediaRepository } from './data/repositories/media'
import { ReportRepository } from './data/repositories/reports'
import { ReviewRepository } from './data/repositories/reviews'
import { TagRepository } from './data/repositories/tags'
import { ViewRepository } from './data/repositories/views'
import { CommentsUseCase } from './domain/useCases/comments'
import { LikesUseCase } from './domain/useCases/likes'
import { MediaUseCase } from './domain/useCases/media'
import { ReportsUseCase } from './domain/useCases/reports'
import { ReviewsUseCase } from './domain/useCases/reviews'
import { TagsUseCase } from './domain/useCases/tags'
import { ViewsUseCase } from './domain/useCases/views'

const commentRepository = CommentRepository.getInstance()
const likeRepository = LikeRepository.getInstance()
const mediaRepository = MediaRepository.getInstance()
const reportRepository = ReportRepository.getInstance()
const reviewRepository = ReviewRepository.getInstance()
const viewRepository = ViewRepository.getInstance()
const tagRepository = TagRepository.getInstance()

export const CommentsUseCases = new CommentsUseCase(commentRepository)
export const LikesUseCases = new LikesUseCase(likeRepository)
export const MediaUseCases = new MediaUseCase(mediaRepository)
export const ReportsUseCases = new ReportsUseCase(reportRepository)
export const ReviewsUseCases = new ReviewsUseCase(reviewRepository)
export const ViewsUseCases = new ViewsUseCase(viewRepository)
export const TagsUseCases = new TagsUseCase(tagRepository)

export { CommentMeta, InteractionEntities, TagMeta, TagTypes } from './domain/types'
export { verifyInteraction } from './utils'

export { CommentEntity } from './domain/entities/comments'
export { LikeEntity } from './domain/entities/likes'
export { MediaEntity } from './domain/entities/media'
export { ReportEntity } from './domain/entities/reports'
export { ReviewEntity } from './domain/entities/reviews'
export { TagEntity } from './domain/entities/tags'
export { ViewEntity } from './domain/entities/views'
