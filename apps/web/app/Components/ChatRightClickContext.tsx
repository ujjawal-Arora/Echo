export default function RightClick({x,y}:{x:number,y:number}){
    return (
        <div 
        style={{top:y,left:x}}
        className="font-mono text-3xl text-[#DB1A5A] absolute p-4 rounded">
            Right Click
        </div>
    )
}