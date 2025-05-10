import type { InjectionKey, Ref } from 'vue'
import type { State } from '@/types/countryStateCity'

export const statesKey = Symbol('states') as InjectionKey<Ref<State[]>>
