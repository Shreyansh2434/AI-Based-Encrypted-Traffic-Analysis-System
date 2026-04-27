import GaugeChart from "react-gauge-chart"

export default function RiskGauge({value}){

 return(

 <GaugeChart
   id="risk-gauge"
   nrOfLevels={20}
   percent={value/100}
   colors={["#22c55e","#facc15","#ef4444"]}
 />

 )

}