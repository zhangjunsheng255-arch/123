import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../../schema';

export const useStatusStore = defineMvuDataStore(Schema, { type: 'message' });
