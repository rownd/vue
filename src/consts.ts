import { InjectionKey } from 'vue';
import { IRowndContext } from './types/RowndContext';

/**
 * @ignore
 */
export const ROWND_INJECTOR_ID = '$rownd';

export const ROWND_INJECTION_KEY: InjectionKey<IRowndContext> = Symbol(ROWND_INJECTOR_ID);