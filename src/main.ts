import { App, inject, Plugin, ShallowRef } from 'vue';
import { ROWND_INJECTION_KEY } from './consts';
import { initContext } from './hub-context';
import { injectHub } from './hub-injector';
import { PluginOptions } from './types/PluginOptions';
import { IRowndContext } from './types/RowndContext';

const RowndPlugin: Plugin = {
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

export default RowndPlugin;

export function useRownd(): ShallowRef<IRowndContext> {
    return inject(ROWND_INJECTION_KEY);
}
