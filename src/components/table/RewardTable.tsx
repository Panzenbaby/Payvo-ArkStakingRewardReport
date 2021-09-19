import React from 'react';
import {Transaction} from '../../Types';

interface RewardTableProps {
    selectedYear: number,
    rewardData: Map<number, Transaction[]>
}

export const RewardTable = (props: RewardTableProps) => {
    const currentData = props.rewardData.get(props.selectedYear) ? props.rewardData.get(props.selectedYear) : [];

    return (
        <div>Found {currentData.length} for {props.selectedYear}</div>
    );
};

export default RewardTable;
