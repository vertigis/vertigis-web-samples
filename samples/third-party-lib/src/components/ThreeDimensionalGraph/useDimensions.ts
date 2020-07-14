import { useCallback, useLayoutEffect, useState, Ref } from "react";

export type UseDimensionsHook<T extends HTMLElement> = [
    /** The `React.Ref` function to be provided as the `ref` prop of the `HTMLElement` to measure. */
    Ref<T>,
    /** The dimensions of the element. */
    DOMRect | undefined
];

export default function useDimensions<
    T extends HTMLElement = HTMLElement
>(): UseDimensionsHook<T> {
    const [dimensions, setDimensions] = useState<DOMRect>();
    const [node, setNode] = useState<T>(null);

    const ref = useCallback((node: T | null) => {
        setNode(node);
    }, []);

    useLayoutEffect(() => {
        if (node) {
            const measure = () => setDimensions(node.getBoundingClientRect());
            measure();

            const resizeObserver = new ResizeObserver(() => measure());
            resizeObserver.observe(node);

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [node]);

    return [ref, dimensions];
}
