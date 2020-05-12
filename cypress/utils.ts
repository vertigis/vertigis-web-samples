export function getCurrentViewpoint(mapEl: JQuery<HTMLDivElement>) {
    const mapId = mapEl[0].getAttribute("gcx-id")!;
    const win = mapEl[0].ownerDocument?.defaultView! as any;

    const map = win.__maps[mapId] || win.__scenes[mapId];

    return map.viewpoint.toJSON();
}
