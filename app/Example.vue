<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import resizeIframe from '~/utils/resize';

const iframeId = 'exampleIframe';
const iFrameRef = ref<HTMLIFrameElement | null>(null);

let cleanup: (() => void) | undefined;
const isVisible = ref(false);

function showIframe() {
  console.debug('[Component] Showing iFrame');
  setTimeout(() => {
    isVisible.value = true;
  }, 300);
}

onMounted(() => {
  console.debug('[Component] iFrame readie ...');
  cleanup = resizeIframe({
    mode: 'landscape',
    element: iFrameRef.value,
  });
  console.debug('[Component] Took:', performance.now());
});

onUnmounted(() => {
  // Cleanup the event listener on unmount
  if (cleanup) cleanup();
});
</script>

<template>
  <div>
    <!-- Example with ID -->
    <iframe
        :class="[isVisible ? 'show' : 'hide']"
        ref="iFrameRef"
        scrollable="no"
        frameborder="0"
        id="exampleIframe"
        src="https://www.youtube.com/embed/7AM-pMYRA1I?si=8-Ju2PPLeqvkQXD"
        style="width: 100%; border: none"
    ></iframe>
  </div>
</template>
<style scoped>
.show {
  opacity: 1;
}

.hide {
  opacity: 0;
}
</style>
