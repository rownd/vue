import { reactive, ref, ShallowRef } from 'vue';
import { useImmer } from './lib/immer';
import { IRowndContext } from "./types/RowndContext";

type HubListenerProps = {
    state: any;
    api: any;
};

export function initContext(): { hubContext: ShallowRef<IRowndContext>; hubStateListener: any } {

    const apiQueue = [];
    let hubApi = {};
    let [hubContext, updateHubContext] = useImmer<IRowndContext>({
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
        },
    });

    function callHubApi(fnName: string, ...args: any[]) {
        if (hubApi[fnName]) {
            return hubApi[fnName](...args);
        }

        apiQueue.push({ fnName, args });
    }

    function flushApiQueue() {
        if (!apiQueue.length) {
            return;
        }

        for (let { fnName, args } of apiQueue) {
            if (!hubApi[fnName]) {
                return;
            }

            hubApi[fnName](...args);
        }

        apiQueue.length = 0;
    }

    function hubStateListener({ state, api }: HubListenerProps) {
        hubApi = api;

        let transformedContext: IRowndContext = {
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
                ...state.user,
            },
        };

        flushApiQueue();

        updateHubContext((ctx: IRowndContext) => {
            return transformedContext;
        });
    };

    return {
        hubContext,
        hubStateListener,
    }
}