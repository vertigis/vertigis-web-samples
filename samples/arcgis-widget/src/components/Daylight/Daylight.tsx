import React from "react";
import { LayoutElementProperties } from "@vertigis/web/components";
import EsriDaylight from "esri/widgets/Daylight";
import DaylightModel from "./DaylightModel";
import { createEsriMapWidget } from "./EsriMapWidget";

const DaylightWrapper = createEsriMapWidget(EsriDaylight);

const Daylight = (
    props: LayoutElementProperties<DaylightModel>
): React.ReactElement => <DaylightWrapper {...props} />;

export default Daylight;
