import produce from 'immer'
import { ShallowRef, shallowRef } from 'vue'

export function useImmer<T>(baseState: T): [ShallowRef<T>, (updater: (ctx: T) => void) => void] {
    const state = shallowRef(baseState);
    const update = (updater: (ctx: T) => void) => {
        state.value = produce(state.value, updater)
    }

    return [state, update]
}