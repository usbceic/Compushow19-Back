import { NomineeCommentModel } from './models';

export interface NomineeCommentLookupRequest {
  id: number
}

export interface NomineeCommentsByCategoryLookupRequest {
  categoryId: number
}

export interface NomineeComment extends NomineeCommentModel