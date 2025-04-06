import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

interface GraphProps {
    data: {
        labels: string[];
        values: number[];
    };
}

export const LineGraph: React.FC<GraphProps> = ({ data }) => (
    <LineChart
        data={{
            labels: data.labels,
            datasets: [{ data: data.values }],
        }}
        width={screenWidth - 20}
        height={220}
        chartConfig={{
            backgroundColor: '#1E2923',
            backgroundGradientFrom: '#08130D',
            backgroundGradientTo: '#1F4037',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
    />
);

export const BarGraph: React.FC<GraphProps> = ({ data }) => (
    <BarChart
        data={{
            labels: data.labels,
            datasets: [{ data: data.values }],
        }}
        width={screenWidth - 20}
        height={220}
        chartConfig={{
            backgroundColor: '#022173',
            backgroundGradientFrom: '#1E3C72',
            backgroundGradientTo: '#2A5298',
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        verticalLabelRotation={30}
        yAxisLabel=""
        yAxisSuffix=""
    />
);


interface PieGraphData {
    name: string;
    amount: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
}

export const PieGraph: React.FC<{ data: PieGraphData[] }> = ({ data }) => (
    <PieChart
        data={data}
        width={screenWidth}
        height={220}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        chartConfig={{
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        }}
    />
);
