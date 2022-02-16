import { Feature } from "@vertigis/arcgis-extensions/data/Feature";
import { FeatureStream } from "@vertigis/arcgis-extensions/data/FeatureStream";
import {
    Features,
    HasFeatures,
    isFeatureStream,
    isFeature,
    isFeatureList,
} from "@vertigis/web/messaging";

// NOTE: These utilities may be exposed in a later version of VertiGIS Studio
// Web. Remove if accessible via web.

export async function toFeatureArray(features: Features): Promise<Feature[]> {
    if (isFeatureStream(features)) {
        return features.toArray();
    } else if (isFeatureStream((features as HasFeatures)?.features)) {
        return ((features as HasFeatures).features as FeatureStream).toArray();
    } else {
        return toFeatureArraySync(features);
    }
}

export function toFeatureArraySync(features: Features): Feature[] {
    if (isFeatureStream(features)) {
        throw new Error(
            "Cannot convert FeatureStream via toFeatureArraySync. Use toFeatureArray instead."
        );
    } else if (!features) {
        return [];
    } else if (Array.isArray(features)) {
        return features.map((f) => (isFeature(f) ? f : new Feature(f)));
    } else if (isFeature(features)) {
        return [features];
    } else if (isFeatureList(features)) {
        return features.toArray();
    } else if (features[Symbol.iterator]) {
        // This also handles FeatureSet since it implements Iterable<Feature>.
        return [...(features as Iterable<Feature>)].map((f) =>
            isFeature(f) ? f : new Feature(f)
        );
    } else {
        return toFeatureArraySync((features as HasFeatures).features);
    }
}
