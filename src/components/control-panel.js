import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel } from "@material-ui/core";
import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { handleChecked, selectChecked } from "../redux/donationReducer";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    formControl: {
        padding: 0,
        // size: "small",
    },
    formLabel: {
        color: "white",
        // fontSize: "inherit",
    },
}));

export default function ControlPanel(props) {
    const classes = useStyles();
    const checked = useSelector(selectChecked);
    const dispatch = useDispatch();

    const handleChange = (event) => {
        dispatch(handleChecked({ name: event.target.name, checked: event.target.checked }));
    };

    return (
        <div className={props.className}>
            {/* <h3>Highlight Features Containing Similar Data</h3>
            <p>Hover over counties to highlight counties that share the same name.</p>
            <div className="source-link">
                <a href="https://github.com/visgl/react-map-gl/tree/6.0-release/examples/filter" target="_new">
                    View Code ↗
                </a>
            </div> */}
            <FormLabel className={classes.formLabel}>Choose What Type of Donations to See</FormLabel>
            <br />
            <FormControl component="fieldset">
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={checked.id}
                                onClick={(e) => {
                                    handleChange(e);
                                }}
                                name="id"
                            />
                        }
                        label="Individual Donations"
                    />
                    <FormControlLabel
                        control={<Checkbox size="small" checked={checked.org} onChange={handleChange} name="org" />}
                        label="Organization Donations"
                    />
                    <FormControlLabel
                        control={<Checkbox size="small" checked={checked.com} onChange={handleChange} name="com" />}
                        label="Committee Donations"
                    />
                </FormGroup>
                {/* <FormHelperText>Be careful</FormHelperText> */}
            </FormControl>
        </div>
    );
}
