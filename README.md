<p align="center">
  <img src="https://i.imgur.com/qTtnyT3.png" width="300" alt="Iframe Resizer"/>
</p>

<h1 align="center">📏 iFrame Resizer 📏</h1>

<p align="center">
  A modern solution for resizing iframes dynamically using <b>IntersectionObserver</b> and <b>ResizeObserver</b>. Works seamlessly with iframes from both same-origin and cross-origin sources 🌐. 
</p>

<p align="center">
  <a href="https://github.com/lafllamme/IframeResizer/commits/main"><img src="https://img.shields.io/github/last-commit/lafllamme/Resizer" alt="Last Commit"></a>
  <a href="https://github.com/lafllamme/IframeResizer/issues"><img src="https://img.shields.io/github/issues/lafllamme/Resizer" alt="Open Issues"></a>
  <a href="https://github.com/lafllamme/IframeResizer/pulls"><img src="https://img.shields.io/github/issues-pr/lafllamme/Resizer" alt="Open Pull Requests"></a>
  <a href="https://github.com/lafllamme/IframeResizer"><img src="https://img.shields.io/github/license/lafllamme/Resizer" alt="License"></a>
  <img src="https://img.shields.io/badge/status-beta-orange" alt="Beta Status">
  <img src="https://img.shields.io/npm/v/iframe-resizer" alt="Coming Soon to NPM">
</p>

## 🚀 Features

- Resizes iframes dynamically based on content size or viewport dimensions 📐.
- Supports multiple modes: `fullscreen` and `landscape` (16:9 aspect ratio) 🌟.
- Handles both same-origin and cross-origin iframes with ease 🛡️.
- Utilizes `IntersectionObserver` for visibility-based resizing 👀.
- Employs `ResizeObserver` to monitor parent container size adjustments 🏗️.
- Includes debouncing for optimized performance ⚡.

## 🛠 Prerequisites

Make sure you have the following:

- **Modern Browser** with `IntersectionObserver` and `ResizeObserver` support.
- **JavaScript/TypeScript** environment.

## 📦 Installation

Coming soon to **npm**! Meanwhile, clone the repository:

```bash
git clone https://github.com/lafllamme/IframeResizer.git
```

## 🌐 Usage

Here's how you can use the package to resize an iframe dynamically:

### Basic Example

```typescript
import resizeIframe from '~/utils/resize';

const cleanup = resizeIframe({
  id: 'exampleIframe',
  mode: 'landscape',
  debounceMs: 200,
  onResized: () => console.log('Iframe resized!'),
});

// Call cleanup() to remove listeners when no longer needed.
```

### Vue 3 Integration Example

```vue
<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import resizeIframe from '~/utils/resize';

const iframeRef = ref<HTMLIFrameElement | null>(null);
let cleanup: (() => void) | undefined;

onMounted(() => {
  cleanup = resizeIframe({
    element: iframeRef.value,
    mode: 'fullscreen',
  });
});

onUnmounted(() => {
  if (cleanup) cleanup();
});
</script>

<template>
  <iframe
    ref="iframeRef"
    src="https://example.com"
    style="width: 100%; border: none;"
  ></iframe>
</template>
```

## 📚 API

### `resizeIframe(options: ResizeOptions): () => void`

| Option         | Type                  | Default     | Description                                                   |
|----------------|-----------------------|-------------|---------------------------------------------------------------|
| `id`           | `string`             | `undefined` | The `id` of the iframe to resize.                            |
| `element`      | `HTMLIFrameElement`  | `undefined` | The iframe element reference.                                |
| `debounceMs`   | `number`             | `100`       | Debounce delay for resizing.                                 |
| `mode`         | `'fullscreen' \| 'landscape'` | `'fullscreen'` | Resizing mode: fullscreen or 16:9 aspect ratio.               |
| `onResized`    | `() => void`         | `undefined` | Callback executed after each resize.                         |

Returns a cleanup function to remove listeners when no longer needed.

## 📌 Notes

- Cross-origin iframes will be resized based on the parent container.
- Ensure iframes are initially styled with `opacity: 0` to prevent flickering during the first resize.

## 🤝 Contributing

Contributions are welcome! Open an issue or submit a pull request to enhance functionality.

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

<p align="center">Made with ❤️ by <a href="https://github.com/lafllamme">lafllamme</a></p>
