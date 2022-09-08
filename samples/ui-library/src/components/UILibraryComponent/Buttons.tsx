import { UIContext } from "@vertigis/web/ui";
import Button from "@vertigis/web/ui/Button";
import Stack from "@vertigis/web/ui/Stack";
import TrashIcon from "@vertigis/web/ui/icons/Trash";
import { ReactElement, useContext } from "react";

const ButtonRow = (props) => (
    <Stack spacing={1} direction="row" alignItems="center" {...props} />
);

export default function Buttons(): ReactElement {
    const { commands } = useContext(UIContext);

    const handleClick = () =>
        commands.ui.alert.execute({
            message: "Button clicked!",
        });

    return (
        <Stack spacing={2}>
            <ButtonRow>
                <Button onClick={handleClick} emphasis="low" size="small">
                    Low Emphasis S
                </Button>
                <Button onClick={handleClick} emphasis="low">
                    Low Emphasis M
                </Button>
                <Button onClick={handleClick} emphasis="low" size="large">
                    Low Emphasis L
                </Button>
                <Button onClick={handleClick} emphasis="low" disabled>
                    Disabled
                </Button>
            </ButtonRow>
            <ButtonRow>
                <Button onClick={handleClick} size="small">
                    Medium Emphasis S
                </Button>
                <Button onClick={handleClick}>Medium Emphasis M</Button>
                <Button onClick={handleClick} size="large">
                    Medium Emphasis L
                </Button>
                <Button onClick={handleClick} disabled>
                    Disabled
                </Button>
            </ButtonRow>
            <ButtonRow>
                <Button onClick={handleClick} emphasis="high" size="small">
                    High Emphasis S
                </Button>
                <Button onClick={handleClick} emphasis="high">
                    High Emphasis M
                </Button>
                <Button onClick={handleClick} emphasis="high" size="large">
                    High Emphasis L
                </Button>
                <Button onClick={handleClick} emphasis="high" disabled>
                    Disabled
                </Button>
            </ButtonRow>
            <ButtonRow>
                <Button
                    onClick={handleClick}
                    size="small"
                    startIcon={<TrashIcon fontSize="small" />}
                />
                <Button
                    onClick={handleClick}
                    startIcon={<TrashIcon fontSize="medium" />}
                />
                <Button
                    onClick={handleClick}
                    size="large"
                    startIcon={<TrashIcon fontSize="large" />}
                />
                <Button onClick={handleClick} startIcon={<TrashIcon />}>
                    Icon and Text
                </Button>
                <Button onClick={handleClick} endIcon={<TrashIcon />}>
                    Text and Icon
                </Button>
            </ButtonRow>
            <ButtonRow>
                <Button
                    onClick={handleClick}
                    buttonStyle="round"
                    size="small"
                    startIcon={<TrashIcon fontSize="small" />}
                />
                <Button
                    onClick={handleClick}
                    buttonStyle="round"
                    startIcon={<TrashIcon fontSize="medium" />}
                />
                <Button
                    onClick={handleClick}
                    buttonStyle="round"
                    size="large"
                    startIcon={<TrashIcon fontSize="large" />}
                />
                <Button
                    onClick={handleClick}
                    buttonStyle="round"
                    startIcon={<TrashIcon />}
                >
                    Icon and Text
                </Button>
                <Button
                    onClick={handleClick}
                    buttonStyle="round"
                    endIcon={<TrashIcon />}
                >
                    Text and Icon
                </Button>
            </ButtonRow>
        </Stack>
    );
}
