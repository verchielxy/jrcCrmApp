<template>
  <div
    :class="['material-symbol', typeClass,]"
    :style="computedStyle"
  >
    {{ props.name }}
  </div>
</template>

<script>
  import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
  import { useStore } from 'vuex';

  export default {
    name: 'MaterialSymbol',
    props: {
      name: { type: String, required: true },
      filled: { type: Boolean, default: false },
      weight: { type: Number, default: 400 },
      grad: { type: Number, default: 0 },
      opsz: { type: Number, default: 24 },
      size: { type: [Number, String] },
      type: {
        type: String,
        default: 'outlined',
        validator: (v) => ['outlined', 'rounded', 'sharp'].includes(v),
      },
    },
    setup(props, context) {
      const { proxy } = getCurrentInstance();
      const store = useStore();

      const typeClass = computed(() => `material-symbols-${props.type}`)

      const computedStyle = computed(() => ({
        fontVariationSettings: `'FILL' ${props.filled ? 1 : 0}, 'wght' ${props.weight}, 'GRAD' ${props.grad}, 'opsz' ${props.opsz}`,
        fontSize: typeof props.size === 'number' ? `${props.size}px` : null,
      }))

      return {
        props,
        typeClass,
        computedStyle,
      }
    },
  }
</script>

<style scoped>
  .material-symbol {
    font-style: normal;
    font-weight: normal;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    direction: ltr;
    -webkit-font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
  }

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined Variable', sans-serif;
  }
  .material-symbols-rounded {
    font-family: 'Material Symbols Rounded Variable', sans-serif;
  }
  .material-symbols-sharp {
    font-family: 'Material Symbols Sharp Variable', sans-serif;
  }
</style>
