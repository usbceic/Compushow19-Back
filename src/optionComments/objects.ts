import { OptionCommentModel } from './models';

export interface OptionCommentLookupRequest {
  id: number
}

export interface OptionCommentsByOptionLookupRequest {
  optionId: number
}

export interface OptionComment extends OptionCommentModel