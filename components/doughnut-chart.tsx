"use client"
import { Chart as ChartJS, Tooltip, Legend,ArcElement } from "chart.js";

import { Doughnut } from "react-chartjs-2";


ChartJS.register(ArcElement, Tooltip, Legend);
export default function DoughnutChart({accounts}: DoughnutChartProps){
    const data = {
        datasets: [
            {
                label: "Banks",
                data: [9932,7650,4560],
                backgroundColor: ["#0747b6", "#2265d8", "#2f91fa"]
            },
        ],
        labels: ["Bank A", "Bank B", "Bank C"]
    }
    return <Doughnut 
        data={data} 
        options={{
            cutout: "70%",
            plugins: {
                legend:{
                    display: false
                }
            }
        }}
        />
}