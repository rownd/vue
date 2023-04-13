import type { InjectionKey, UnwrapNestedRefs } from 'vue';
import type { IRowndContext } from './types/RowndContext';

/**
 * @ignore
 */
export const ROWND_INJECTOR_ID = '$rownd';

export const ROWND_INJECTION_KEY: InjectionKey<
  UnwrapNestedRefs<IRowndContext>
> = Symbol(ROWND_INJECTOR_ID);
