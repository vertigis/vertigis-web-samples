import {
    createTheme,
    GcxThemeProvider,
    styled,
} from "@vertigis/react-ui/styles";
import CssBaseline from "@vertigis/react-ui/CssBaseline";
import Drawer from "@vertigis/react-ui/Drawer";
import Box from "@vertigis/react-ui/Box";
import List from "@vertigis/react-ui/List";
import ListItem from "@vertigis/react-ui/ListItem";
import ListItemText from "@vertigis/react-ui/ListItemText";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import Sample from "./Sample";
import SampleViewer from "./SampleViewer";

const samples = [
    { id: "arcgis-widget", title: "ArcGIS Widget" },
    { id: "basic-component", title: "Basic Component" },
    { id: "basic-service", title: "Basic Service" },
    { id: "commands-and-operations", title: "Commands and Operations" },
    { id: "tap-into-web-event", title: "Tap into a Web event" },
    { id: "embedded-map", title: "Embedded Map" },
    { id: "i18n", title: "Internationalization" },
    { id: "iframe", title: "Iframe Embedded" },
    { id: "third-party-lib", title: "3rd-party Library" },
    { id: "ui-library", title: "UI Library" },
] as const;

async function getSampleData(sampleName: string): Promise<Sample> {
    const [app, layout, library, readme] = await Promise.all([
        import(`../../samples/${sampleName}/app/app.json`),
        import(`../../samples/${sampleName}/app/layout.xml`),
        import(`!!file-loader!../../samples/${sampleName}/build/main.js`),
        import(`../../samples/${sampleName}/README.md`),
    ]);

    let parentPage;

    try {
        parentPage = await import(
            `!!file-loader!../../samples/${sampleName}/app/parent.html`
        );
    } catch {
        // This sample doesn't have a custom page. Continue on.
    }

    return {
        app: app.default,
        layout: layout.default,
        library: library.default,
        parentPage: parentPage && parentPage.default,
        readme: readme.default,
        repositoryBasePath: `https://github.com/vertigis/vertigis-web-samples/tree/master/samples/${sampleName}/`,
        codesandboxLink: !!parentPage
            ? `https://codesandbox.io/s/github/vertigis/vertigis-web-samples/tree/master/samples/${sampleName}/?initialpath=/parent.html`
            : `https://codesandbox.io/s/github/vertigis/vertigis-web-samples/tree/master/samples/${sampleName}/`,
    };
}

function ListItemLink(props) {
    const { children, to, ...other } = props;

    const renderLink = useMemo(
        () =>
            forwardRef<HTMLAnchorElement>((itemProps, ref) => (
                <RouterLink to={to} ref={ref} {...itemProps} />
            )),
        [to]
    );

    return (
        <li>
            <ListItem button component={renderLink as any} {...other}>
                {children}
            </ListItem>
        </li>
    );
}

const Main = styled("main")(({ theme }) => ({
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: 32,
    height: "100vh",
    overflowY: "auto",
}));

const StyledDrawer = styled(Drawer)(() => ({
    width: 240,
    flexShrink: 0,
}));

const theme = createTheme();

function App() {
    const location = useLocation();
    const history = useHistory();
    const selectedSampleId = location.pathname.replace(
        `${process.env.PUBLIC_URL}/`,
        ""
    );
    const [selectedSample, setCurrentSample] = useState<Sample>();

    useEffect(() => {
        // Set default path if we're at the base path
        if (location.pathname === `${process.env.PUBLIC_URL}/`) {
            history.replace(`${process.env.PUBLIC_URL}/${samples[0].id}`);
        }
    }, [location, history]);

    useEffect(() => {
        if (!selectedSampleId) {
            setCurrentSample(undefined);
            return;
        }

        let didCancel = false;

        (async () => {
            const loadedSample = await getSampleData(selectedSampleId);

            if (didCancel) {
                return;
            }

            setCurrentSample(loadedSample);
        })();

        return () => {
            didCancel = true;
        };
    }, [selectedSampleId]);

    return (
        <GcxThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <StyledDrawer variant="permanent" open>
                    <List>
                        {samples.map((sample) => (
                            <ListItemLink
                                key={sample.id}
                                to={`/${sample.id}`}
                                selected={sample.id === selectedSampleId}
                            >
                                <ListItemText primary={sample.title} />
                            </ListItemLink>
                        ))}
                    </List>
                </StyledDrawer>
                <Main>
                    {selectedSample && (
                        <SampleViewer
                            key={selectedSampleId}
                            sample={selectedSample}
                        />
                    )}
                </Main>
            </Box>
        </GcxThemeProvider>
    );
}

export default App;
