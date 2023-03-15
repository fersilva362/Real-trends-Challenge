import React from 'react'
import logoPol from '~/assets/poll.jpg'
import {useState} from 'react'
import styles from "./Home.module.scss";
export default function Poll({handleStatus, status}){
  

  return(
    <div className={styles.pollcontainer}>

      <h2>Pollbox controls</h2>
      <div className={styles.pollelements}>
        <img src={logoPol} width='50px'/>
        <div className={styles.pollselect}>
          <label > Select polling status:</label>
          <div className={styles.selectelement}>
            <select value={status} onChange={(e)=>handleStatus(e.target.value)}>
            <option value='active' > active </option>
              <option value='pause' > pause </option>
              {/* <option value='resume'> resume</option> */}
              <option value='reset'> reset</option>
            </select>
          </div>
          
        </div>
        
      </div>
      {/* <h3>The polling is <span>active</span></h3> */}
    </div>
     

  )
}