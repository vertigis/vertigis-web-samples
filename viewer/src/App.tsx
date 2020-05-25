import {
    createTheme,
    makeStyles,
    GcxThemeProvider,
} from "@vertigis/react-ui/styles";
import CssBaseline from "@vertigis/react-ui/CssBaseline";
import List from "@vertigis/react-ui/List";
import ListItem from "@vertigis/react-ui/ListItem";
import ListItemText from "@vertigis/react-ui/ListItemText";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import Sample from "./Sample";
import SampleViewer from "./SampleViewer";

const samples = [
    { id: "basic-component", title: "Basic Component" },
    { id: "basic-service", title: "Basic Service" },
    { id: "commands-and-operations", title: "Commands and Operations" },
    { id: "i18n", title: "Internationalization" },
    { id: "iframe", title: "Iframe Embedded" },
    { id: "ui-library", title: "UI Library" },
] as const;

async function getSampleData(sampleName: string): Promise<Sample> {
    const [app, layout, library, readme] = await Promise.all([
        import(`../../samples/${sampleName}/app/app.json`),
        import(`!!file-loader!../../samples/${sampleName}/app/layout.xml`),
        import(`!!file-loader!../../samples/${sampleName}/build/main.js`),
        import(`!!file-loader!../../samples/${sampleName}/README.md`),
    ]);

    let page;

    try {
        page = await import(
            `!!file-loader!../../samples/${sampleName}/index.html`
        );
    } catch {
        // This sample doesn't have a custom page. Continue on.
    }

    return {
        app: app.default,
        layout: layout.default,
        library: library.default,
        page: page && page.default,
        readme: readme.default,
        repositoryBasePath: `https://github.com/geocortex/vertigis-web-samples/tree/master/samples/${sampleName}/`,
    };
}

function ListItemLink(props) {
    const { children, to, ...other } = props;

    const renderLink = React.useMemo(
        () =>
            React.forwardRef<HTMLAnchorElement>((itemProps, ref) => (
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

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
    },
    drawer: {
        flexShrink: 0,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: 0,
        height: "100vh",
    },
}));

const theme = createTheme();

function App() {
    const classes = useStyles();

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
            <div className={classes.root}>
                <List className={classes.drawer}>
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
                <main className={classes.content}>
                    {selectedSample && (
                        <SampleViewer
                            key={selectedSampleId}
                            sample={selectedSample}
                        />
                    )}
                </main>
            </div>
        </GcxThemeProvider>
    );
}

export default App;
