import type { App, Plugin, UnwrapNestedRefs } from 'vue';
import type { PluginOptions } from './types/PluginOptions';
import type { IRowndContext } from './types/RowndContext';

import { inject } from 'vue';
import { ROWND_INJECTION_KEY } from './consts';
import { initContext } from './hub-context';
import { injectHub } from './hub-injector';

export const RowndPlugin: Plugin = {
  // called by Vue.use(Rownd)
  install(Vue: App, options: PluginOptions) {
    const { hubContext, hubStateListener } = initContext();
    injectHub({
      ...options,
      stateListener: hubStateListener,
    });

    Vue.provide(ROWND_INJECTION_KEY, hubContext);
  },
};

export function useRownd(): UnwrapNestedRefs<IRowndContext> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return inject(ROWND_INJECTION_KEY)!;
}
