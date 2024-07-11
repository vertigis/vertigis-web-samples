/* eslint-disable react/display-name */
import type { LayoutElementProperties } from "@vertigis/web/components";
import { LayoutElement } from "@vertigis/web/components";
import { useWatchAndRerender } from "@vertigis/web/ui";
import Markdown from "@vertigis/web/ui/Markdown";
import Stack from "@vertigis/web/ui/Stack";
import Typography from "@vertigis/web/ui/Typography";
import type { FC } from "react";
import { useEffect, useState } from "react";

import type ReadMeModel from "./ReadMeModel";

export interface ReadMeProps extends LayoutElementProperties<ReadMeModel> {}

const ReadMe: FC<ReadMeProps> = ({ model, ...layoutProps }) => {
    const [readmeText, setReadmeText] = useState<string>();
    const [codePageText, setCodePageText] = useState<string>();
    const { codePageTitle } = model;
    useWatchAndRerender(model, "readme");
    useWatchAndRerender(model, "codePage");

    useEffect(() => {
        setReadmeText(model.readme);
    }, [model.readme]);

    useEffect(() => {
        setCodePageText(model.codePage);
    }, [model.codePage]);

    return (
        <LayoutElement stretch {...layoutProps}>
            <Stack direction="row">
                {readmeText && (
                    <Markdown
                        text={readmeText}
                        sx={{ marginLeft: 4, marginRight: 4 }}
                    />
                )}
                {codePageText && (
                    <Stack sx={{ width: "100%" }}>
                        <Typography
                            variant="h5"
                            sx={{ marginBottom: 1, marginLeft: 4 }}
                        >
                            {codePageTitle}
                        </Typography>
                        <Markdown
                            text={codePageText}
                            sx={{
                                marginLeft: 4,
                                marginRight: 4,
                                overflowY: "auto",
                            }}
                        />
                    </Stack>
                )}
            </Stack>
        </LayoutElement>
    );
};

export default ReadMe;
