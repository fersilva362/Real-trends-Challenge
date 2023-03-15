import React, { useEffect, useState } from "react"
import styles from "./Home.module.scss";

interface Props {
  size:number, strokeWidth:number, percentage:number, color:string, voteUser?:number
}
export default function CircularProgress({size, strokeWidth,percentage,color}:Props){
  const [progress, setProgress]=useState(0)
  useEffect(()=>setProgress(percentage),[percentage])
  const viewBox=`0 0 ${size} ${size}`
  const radius=(size-strokeWidth)/2
  const circunference:number=radius*Math.PI*2
  const dash:number=circunference*progress/100

  
    return(
   <svg viewBox={viewBox} width={size} height={size}> 
     <circle cx={size/2} cy={size/2} r={radius} fill='none' stroke='#ccc' strokeWidth={`${strokeWidth}px`}/>
     <circle cx={size/2} cy={size/2} r={radius} fill='none'
      stroke={color} strokeWidth={`${strokeWidth}px`} strokeLinecap='round' strokeDasharray={`${dash} ${circunference-dash}`}
      transform={`rotate(-90, ${size/2}, ${size/2})`} 
      style={{transition:'all 0.5s'}}
      />
      <text className={styles.textcircular} x='50%' y='50%' dy='8px'  textAnchor='middle' fontSize='20px' >
       <tspan textAnchor='middle'>{` ${percentage||0}%`}</tspan>
      </text>
   </svg>


  )
}