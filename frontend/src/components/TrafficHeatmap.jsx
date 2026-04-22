export default function TrafficHeatmap(){

 const cells = Array.from({length:64})

 return(

  <div className="bg-white/5 p-6 rounded-xl border border-white/10">

   <h3 className="mb-4">Traffic Heatmap</h3>

   <div className="grid grid-cols-8 gap-1">

    {cells.map((_,i)=>(
     <div
      key={i}
      className="h-6 bg-cyan-400/30 rounded"
     />
    ))}

   </div>

  </div>

 )
}