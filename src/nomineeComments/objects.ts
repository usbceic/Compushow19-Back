import { NomineeCommentModel } from './models';

export interface NomineeCommentLookupRequest {
  id: number
}

export interface NomineeCommentsByNomineeLookupRequest {
  nomineeId: number
}

export interface NomineeComment extends NomineeCommentModel