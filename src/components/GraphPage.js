import React from "react";
import { selectShowDonations, selectTotalDonations } from "../redux/donationReducer";
import { useSelector } from "react-redux";
import { VictoryBar, VictoryChart, VictoryAxis } from "victory";
import chartTheme from "./theme";

export default function GraphPage() {
    const totalDonos = useSelector(selectTotalDonations);
    const showDonos = useSelector(selectShowDonations);

    const dataToShow = () => {
        if (showDonos.totalShowDonation === 0) {
            return [
                { name: "Dem", amount: totalDonos.demDonation },
                { name: "Rep", amount: totalDonos.repDonation },
                { name: "Other", amount: totalDonos.otherDonation },
            ];
        } else {
            return [
                { name: "Dem", amount: showDonos.demShowDonation },
                { name: "Rep", amount: showDonos.repShowDonation },
                { name: "Other", amount: showDonos.otherShowDonation },
            ];
        }
    };

    const numberWithCommas = (x) => {
        if (x >= 10000000) {
            return (x / 1000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "M";
        } else if (x >= 10000) {
            return (x / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "k";
        } else {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    };

    return (
        <VictoryChart height={1050} domainPadding={50} theme={chartTheme} animate={{ duration: 1200 }}>
            <VictoryAxis tickValues={[1, 2]} tickFormat={["Dem", "Rep", "Other"]} />
            <VictoryAxis dependentAxis tickFormat={(x) => `$${numberWithCommas(x)}`} />

            <VictoryBar
                style={{
                    data: { fill: ({ index }) => ["#2196f3", "#ff1744", "#78909c"][index] },
                }}
                barRatio={1.25}
                data={dataToShow()}
                x="name"
                y="amount"
            />
        </VictoryChart>
    );
}
