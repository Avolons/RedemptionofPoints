import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {
    }

    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {
    }

    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}

import { ModalOptions } from 'ant-design-vue/types/modal'
import ErrorHandle from '@/util/errorHandle'


declare module 'vue/types/vue' {

  interface Vue {
    confirm: (title: string, content?: string|Function, option?: ModalOptions) => Promise<any>
    eh: ErrorHandle
      hrefTo: any;
    routeMeta: string
    tmpLoad: boolean
  }
}
