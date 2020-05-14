import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import WebViewer, { Sample } from "./WebViewer";

const samples = [
    "basic-component",
    "commands-and-operations",
    "i18n",
    "iframe",
] as const;

async function getSampleData(sampleName: string): Promise<Sample> {
    const [app, layout, library] = await Promise.all([
        import(`../../samples/${sampleName}/app/app.json`),
        import(`!!file-loader!../../samples/${sampleName}/app/layout.xml`),
        import(`!!file-loader!../../samples/${sampleName}/build/main.js`),
    ]);

    let page;

    try {
        page = (
            await import(`!!file-loader!../../samples/${sampleName}/index.html`)
        ).default;
    } catch {
        // This sample doesn't have a custom page. Continue on.
    }

    return {
        app: app.default,
        layout: layout.default,
        library: library.default,
        page,
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

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        overflow: "hidden",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: 0,
        paddingLeft: drawerWidth,
        height: "100vh",
    },
}));

function App() {
    const classes = useStyles();

    const location = useLocation();
    const history = useHistory();
    const selectedSampleName = location.pathname.replace(
        `${process.env.PUBLIC_URL}/`,
        ""
    );
    const [currentSample, setCurrentSample] = useState<Sample>();

    useEffect(() => {
        // Set default path if we're at the base path
        if (location.pathname === `${process.env.PUBLIC_URL}/`) {
            history.replace(`${process.env.PUBLIC_URL}/${samples[0]}`);
        }
    }, [location, history]);

    useEffect(() => {
        if (!selectedSampleName) {
            setCurrentSample(undefined);
            return;
        }

        let didCancel = false;

        (async () => {
            const loadedSample = await getSampleData(selectedSampleName);

            if (didCancel) {
                return;
            }

            setCurrentSample(loadedSample);
        })();

        return () => {
            didCancel = true;
        };
    }, [selectedSampleName]);

    return (
        <div className="App">
            <CssBaseline />

            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <List>
                    {samples.map((sample) => (
                        <ListItemLink
                            key={sample}
                            to={`/${sample}`}
                            selected={sample === selectedSampleName}
                        >
                            <ListItemText primary={sample} />
                        </ListItemLink>
                    ))}
                </List>
            </Drawer>
            <main className={classes.content}>
                <WebViewer key={selectedSampleName} sample={currentSample} />
            </main>
        </div>
    );
}

export default App;
