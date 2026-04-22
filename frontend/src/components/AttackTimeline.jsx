export default function AttackTimeline({events}){

 return(

  <div className="bg-white/5 p-6 rounded-xl border border-white/10">

   <h3 className="mb-4">Attack Timeline</h3>

   {events.map((e,i)=>(
    <div
     key={i}
     className="flex justify-between border-b border-white/10 py-2"
    >
     <span>{e.time}</span>
     <span>{e.event}</span>
    </div>
   ))}

  </div>

 )
}