import React, { useCallback, useState } from "react";
import { generateUuid } from "@vertigis/arcgis-extensions/utilities/uuid";
import {
    LayoutElement,
    LayoutElementProperties,
} from "@vertigis/web/components";
import { useWatch, useWatchAndRerender } from "@vertigis/web/ui";
import FormControl from "@vertigis/web/ui/FormControl";
import FormLabel from "@vertigis/web/ui/FormLabel";
import MenuItem from "@vertigis/web/ui/MenuItem";
import Select from "@vertigis/web/ui/Select";
import EsriDaylight from "esri/widgets/Daylight";
import DaylightModel from "./DaylightModel";
import { createEsriMapWidget } from "./EsriMapWidget";
import "./Daylight.css";

const DaylightWrapper = createEsriMapWidget(EsriDaylight);

const Daylight = (
    props: LayoutElementProperties<DaylightModel>
): React.ReactElement => {
    const [widget, setWidget] = useState<EsriDaylight | null>();
    // A unique DOM ID to be used for a11y purposes.
    const [selectId] = useState(generateUuid());

    // Any time the `dateOrSeason` model property changes we need to re-render the
    // component so our UI is consistent, as well as set the Esri widget
    // configuration.
    useWatchAndRerender(props.model, "dateOrSeason");
    useWatch(props.model, "dateOrSeason", (newValue) => {
        if (widget) {
            widget.dateOrSeason = newValue;
        }
    });

    // Memoize the callbacks to avoid destroying and re-creating the widget
    // during every render of this component.
    const onWidgetCreated = useCallback(
        (widget: EsriDaylight) => {
            // Synchronize values from model
            widget.dateOrSeason = props.model.dateOrSeason;

            setWidget(widget);
        },
        [props.model]
    );
    const onWidgetDestroyed = useCallback(() => setWidget(null), []);

    return (
        <LayoutElement {...props} className="Daylight">
            <DaylightWrapper
                model={props.model}
                onWidgetCreated={onWidgetCreated}
                onWidgetDestroyed={onWidgetDestroyed}
            />
            {widget && (
                <FormControl className="Daylight-select">
                    <FormLabel htmlFor={selectId}>Date Picker Mode</FormLabel>
                    <Select
                        id={selectId}
                        onChange={(event) => {
                            props.model.dateOrSeason = event.target
                                .value as any;
                        }}
                        value={props.model.dateOrSeason}
                    >
                        <MenuItem value="date">Date</MenuItem>
                        <MenuItem value="season">Season</MenuItem>
                    </Select>
                </FormControl>
            )}
        </LayoutElement>
    );
};

export default Daylight;
