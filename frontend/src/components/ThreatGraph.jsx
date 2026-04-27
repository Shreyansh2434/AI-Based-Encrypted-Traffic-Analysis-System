import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 Tooltip,
 ResponsiveContainer
} from "recharts"

export default function ThreatGraph({data}){

 return(

  <div className="bg-white/5 p-6 rounded-xl border border-white/10">

   <h3 className="mb-4">Threat Activity</h3>

   <ResponsiveContainer width="100%" height={200}>

    <LineChart data={data}>

     <XAxis dataKey="time"/>
     <YAxis/>
     <Tooltip/>

     <Line
      type="monotone"
      dataKey="threats"
      stroke="#22d3ee"
      strokeWidth={2}
     />

    </LineChart>

   </ResponsiveContainer>

  </div>

 )
}