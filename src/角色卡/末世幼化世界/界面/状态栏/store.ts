import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useStatusStore = defineStore(
  'mvu-status-data',
  errorCatched(() => {
    const data = ref<Record<string, any>>(_.get(getVariables({ type: 'message' }), 'stat_data', {}));

    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (variables: Record<string, any>) => {
      data.value = _.get(variables, 'stat_data', {});
    });

    return { data };
  }),
);
