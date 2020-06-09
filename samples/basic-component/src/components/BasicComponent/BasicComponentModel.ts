import {
    ComponentModelBase,
    ComponentModelProperties,
    PropertyDefs,
    serializable,
} from "@vertigis/web/models";

interface BasicComponentModelProperties extends ComponentModelProperties {
    hidden?: boolean;
}

@serializable
export default class BasicComponentModel extends ComponentModelBase<
    BasicComponentModelProperties
> {
    hidden: boolean | undefined;

    // This method defines how the model will be serialized and deserialized into
    // an app item. We override it to include our new property `hidden`.
    protected _getSerializableProperties(): PropertyDefs<
        BasicComponentModelProperties
    > {
        const props = super._getSerializableProperties();
        return {
            ...props,
            hidden: {
                serializeModes: ["initial"],
                default: false,
            },
        };
    }
}
