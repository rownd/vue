import _get from 'lodash-es/get';
import { reactive, type UnwrapNestedRefs } from 'vue';
import type { IRowndContext } from "./types/RowndContext";

type HubListenerProps = {
    state: any;
    api: any;
};

export function initContext(): {
    hubContext: UnwrapNestedRefs<IRowndContext>;
    hubStateListener: (props: HubListenerProps) => void;
} {

    const apiQueue: { fnName: string, args: any[] }[] = [];
    let hubApi: any = {};
    const hubContext = reactive({
        requestSignIn: (...args: any[]) => callHubApi('requestSignIn', ...args),
        getAccessToken: (...args: any[]) => callHubApi('getAccessToken', ...args),
        signOut: (...args: any[]) => callHubApi('signOut', ...args),

        is_initializing: true,
        is_authenticated: false,
        access_token: null,
        auth: {
            access_token: null,
            is_authenticated: false,
        },
        user: {
            data: {},
            redacted_fields: [],
            manageAccount: (...args: any[]) => callHubApi('user.manageAccount', ...args),
        },

        near: {
            createNamedAccount: (...args: any[]) => callHubApi('near.createNamedAccount', ...args),
            ensureImplicitAccount: (...args: any[]) => callHubApi('near.ensureImplicitAccount', ...args),
            walletDetails: (...args: any[]) => callHubApi('near.walletDetails', ...args),
        },
    });

    function callHubApi(fnName: string, ...args: any[]) {
        const fn = _get(hubApi, fnName);
        if (fn) {
            return fn(...args);
        }

        apiQueue.push({ fnName, args });
    }

    function flushApiQueue() {
        if (!apiQueue.length) {
            return;
        }

        for (const { fnName, args } of apiQueue) {
            const fn = _get(hubApi, fnName);
            if (!fn) {
                return;
            }

            fn(...args);
        }

        apiQueue.length = 0;
    }

    function hubStateListener({ state, api }: HubListenerProps) {
        hubApi = api;

        const transformedContext: IRowndContext = {
            // functions
            requestSignIn: (...args: any[]) => callHubApi('requestSignIn', ...args),
            getAccessToken: (...args: any[]) => callHubApi('getAccessToken', ...args),
            signOut: (...args: any[]) => callHubApi('signOut', ...args),

            // data
            is_initializing: state.is_initializing,
            is_authenticated: !!state.auth?.access_token,
            access_token: state.auth?.access_token || null,
            auth: {
                access_token: state.auth?.access_token,
                app_id: state.auth?.app_id,
                is_authenticated: !!state.auth?.access_token,
                is_verified_user: state.auth?.is_verified_user,
            },
            user: {
                manageAccount: (...args: any[]) => callHubApi('user.manageAccount', ...args),
                set: api.user.set,
                setValue: api.user.setValue,
                ...state.user,
            },

            // near
            near: {
                createNamedAccount: (...args: any[]) => callHubApi('near.createNamedAccount', ...args),
                ensureImplicitAccount: (...args: any[]) => callHubApi('near.ensureImplicitAccount', ...args),
                walletDetails: (...args: any[]) => callHubApi('near.walletDetails', ...args),
            },
        };

        flushApiQueue();

        Object.assign(hubContext, transformedContext);

        // User data getters/setters
        if (hubContext?.user?.data) {
            hubContext.user.data = new Proxy(hubContext.user.data, {
                get(target, name, receiver) {
                    if (!Reflect.has(target, name)) {
                        return undefined;
                    }
                    return Reflect.get(target, name, receiver);
                },
                set(target, name, value, receiver) {
                    // return Reflect.set(target, name, value, receiver);
                    hubApi.user.setValue(name, value);
                    return true;
                }
            });
        }
    };

    return {
        hubContext,
        hubStateListener,
    }
}