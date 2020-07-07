import { useCallback, useLayoutEffect, useState } from "react";

export type UseDimensionsHook<T = HTMLElement> = [
    (node: T) => void,
    DOMRect | undefined,
    T
];

export default function useDimensions<T>(): UseDimensionsHook<T> {
    const [dimensions, setDimensions] = useState<DOMRect>();
    const [node, setNode] = useState(null);

    const ref = useCallback((node) => {
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

    return [ref, dimensions, node];
}
