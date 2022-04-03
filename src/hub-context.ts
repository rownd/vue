import { reactive, ref } from 'vue';
import { IRowndContext } from "./types/RowndContext";

type HubListenerProps = {
    state: any;
    api: any;
};

export function initContext() {

    const apiQueue = [];
    const hubApi = reactive({});
    const hubContext = reactive({});

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
        Object.assign(hubApi, api);

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

        Object.assign(hubContext, transformedContext);
    };

    return {
        hubContext,
        hubStateListener,
    }
}