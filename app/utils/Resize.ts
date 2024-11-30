type ResizeOptions = {
    id?: string; // ID of the iframe
    element?: HTMLIFrameElement; // Ref to the iframe element
    debounceMs?: number; // Debounce time for resizing
    mode?: "fullscreen" | "landscape"; // Resize mode: fullscreen or 16:9 aspect ratio
    onResized?: () => void; // Callback executed after resizing
};

const resizeIframe = ({
                          id,
                          element,
                          debounceMs = 100,
                          mode = "fullscreen",
                      }: ResizeOptions) => {
    let iframe: HTMLIFrameElement | null = null;

    console.debug("[Resizer] Input:", id, element, debounceMs, mode);

    // Resolve the iframe element
    if (id) {
        iframe = document.getElementById(id) as HTMLIFrameElement;
    } else if (element) {
        iframe = element;
    }

    if (!iframe) {
        console.error(
            "[Resizer] Iframe element not found. Provide a valid ID or HTMLElement."
        );
        return () => {};
    }
    let endA = performance.now();

    console.debug("[Resizer] Found iframe:", iframe, "ID:", id);

    // Set initial styles for better UX
    iframe.style.transition =
        "height 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)";
    iframe.style.opacity = "0"; // Initially hidden
    iframe.style.visibility = "hidden"; // Prevent flicker before resizing

    /**
     * Calculate the desired height for the iframe
     */
    const calculateHeight = (): number => {
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        console.debug("[Resizer] Viewport dimensions:", {
            viewportHeight,
            viewportWidth,
        });

        if (mode === "fullscreen") {
            console.debug("[Resizer] Mode: Fullscreen. Returning viewport height.");
            return viewportHeight;
        }

        if (mode === "landscape") {
            const height = viewportWidth / (16 / 9);
            console.debug("[Resizer] Mode: 16:9. Calculated height:", height);
            return Math.min(height, viewportHeight);
        }

        console.warn("[Resizer] Unknown mode. Defaulting to fullscreen.");
        return viewportHeight;
    };

    /**
     * Resize the iframe
     */
    const resize = () => {
        console.debug("[Resizer] Resizing iframe...");
        try {
            const height = calculateHeight();
            iframe!.style.height = `${height}px`;
            iframe!.style.opacity = "1"; // Show iframe after resizing
            iframe!.style.visibility = "visible"; // Ensure visibility
            console.debug("[Resizer] Applied height to iframe:", height);
        } catch (error) {
            console.error("[Resizer] Error resizing iframe:", error);
        }
    };

    /**
     * Debounce wrapper
     */
    const debounce = (func: () => void, delay: number) => {
        let timer: number;
        return () => {
            clearTimeout(timer);
            timer = setTimeout(func, delay);
        };
    };

    const debouncedResize = debounce(resize, debounceMs);

    /**
     * Setup IntersectionObserver for viewport resizing
     */
    const setupIntersectionObserver = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    console.debug("[Resizer] Iframe is visible. Resizing...");
                    resize(); // Resize immediately when visible
                    observer.disconnect(); // Stop observing after resizing is complete
                }
            });
        });

        observer.observe(iframe!);
        console.debug("[Resizer] IntersectionObserver attached to iframe.");

        return () => observer.disconnect();
    };

    /**
     * Attach ResizeObserver to parent container
     */
    const setupResizeObserver = () => {
        const parent = iframe!.parentElement;
        if (!parent) return;

        const observer = new ResizeObserver(() => {
            console.debug("[Resizer] Parent container resized. Resizing iframe...");
            debouncedResize();
        });

        observer.observe(parent);
        console.debug("[Resizer] ResizeObserver attached to parent container.");

        return () => observer.disconnect();
    };

    /**
     * Resize immediately before the iframe is fully loaded
     */
    const resizeImmediately = () => {
        console.debug(
            "[Resizer] Immediate resize before iframe content is loaded."
        );
        resize();
    };

    /**
     * Initialize resizing logic
     */
    console.debug("[Resizer] Performing initial resize...");
    resizeImmediately(); // Resize before load event
    const cleanupIntersectionObserver = setupIntersectionObserver();
    const cleanupResizeObserver = setupResizeObserver();

    // Resize on iframe load
    iframe.addEventListener("load", resize);
    console.debug("[Resizer] Attached iframe 'load' event listener.");

    // Resize on window resize
    window.addEventListener("resize", debouncedResize);
    console.debug("[Resizer] Attached window 'resize' event listener.");

    // Cleanup function
    return () => {
        console.debug("[Resizer] Cleaning up...");
        iframe.removeEventListener("load", resize);
        window.removeEventListener("resize", debouncedResize);
        cleanupIntersectionObserver?.();
        cleanupResizeObserver?.();
    };
};

export default resizeIframe;
