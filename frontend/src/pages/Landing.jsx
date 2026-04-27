import { useNavigate } from "react-router-dom"

export default function Landing(){

 const navigate = useNavigate()

 return(

 <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">

   <div className="text-center">

     <h1 className="text-6xl font-bold mb-4">
      Encrypted Traffic AI
     </h1>

     <p className="text-gray-400 mb-8">
      Detect malicious behaviour hidden inside encrypted network traffic
     </p>

     <button
       onClick={()=>navigate("/dashboard")}
       className="px-6 py-3 bg-cyan-500 rounded-lg"
     >
       Launch Dashboard
     </button>

   </div>

 </div>

 )
}