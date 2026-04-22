export default function UploadPanel({setFile,analyze}){

 return(

  <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10">

   <h3 className="text-lg mb-4">Upload Network Traffic Dataset</h3>

   <input
    type="file"
    className="mb-4"
    onChange={(e)=>setFile(e.target.files[0])}
   />

   <button
    onClick={analyze}
    className="bg-cyan-500 px-4 py-2 rounded"
   >
     Analyze Traffic
   </button>

  </div>

 )
}