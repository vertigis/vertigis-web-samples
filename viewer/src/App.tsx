import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React, { useEffect, useState } from "react";
import WebViewer, { Sample } from "./WebViewer";

const samples = ["i18n"] as const;

async function getSampleData(sampleName: string): Promise<Sample> {
    const [app, layout, library] = await Promise.all([
        import(`../../samples/${sampleName}/app/app.json`),
        import(`!!file-loader!../../samples/${sampleName}/app/layout.xml`),
        import(`!!file-loader!../../samples/${sampleName}/build/main.js`),
    ]);

    return {
        app: app.default,
        layout: layout.default,
        library: library.default,
    };
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

    const [currentSample, setCurrentSample] = useState<Sample>();
    const [selectedSampleName, setSelectedSampleName] = useState<
        typeof samples[number]
    >(samples[0]);

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
                        <ListItem
                            button
                            key={sample}
                            onClick={() => setSelectedSampleName(sample)}
                            selected={sample === selectedSampleName}
                        >
                            <ListItemText primary={sample} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <main className={classes.content}>
                <WebViewer sample={currentSample} />
            </main>
        </div>
    );
}

export default App;
