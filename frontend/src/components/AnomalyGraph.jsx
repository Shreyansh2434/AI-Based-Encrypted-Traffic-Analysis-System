import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"

export default function AnomalyGraph({data}){

 return(

 <LineChart width={900} height={250} data={data}>

   <XAxis dataKey="id"/>
   <YAxis/>
   <Tooltip/>

   <Line
     type="monotone"
     dataKey="risk_score"
     stroke="#22c55e"
     strokeWidth={2}
   />

 </LineChart>

 )
}