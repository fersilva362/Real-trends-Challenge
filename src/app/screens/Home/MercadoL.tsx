import React from "react";
import styles from "./Home.module.scss";
import CircularProgress from './CircularProgress';
import avatar1 from '~/assets/avatar-1.jpg'
import avatar2 from '~/assets/avatar-2.jpg'
import avatar3 from '~/assets/avatar-3.jpg'
import avatar4 from '~/assets/avatar-4.jpg'
import {useMemo} from 'react'

interface Product {
  title:string,
  description?:string,
  key:number,
  image:string,
  external?:string
}
interface Vote {
  user:string,
  review?:string,
  vote:Product['key']
}
interface State {
  products:Product[],
  votes:Vote[]
}
///avatar y colores para los usuarios
 const imgRamdom=[avatar1,avatar2,avatar3,avatar4]
const colors=['teal', '#C4421A','#f98f45']

export default function MercadoL({state, handlePoll,status}){
  const totalVotes=state.votes.length
  
  return( 
    
      <div className={styles.containerI}>
      <h2>What earphone design do you prefer?</h2>
      <section className={styles.products}>
        
        {
          state.products.map((product:Product, idx:number)=>{
            const voteUser=(state.votes.filter((ele:Vote)=>ele.vote===product.key))
            
            /* calculo del porcentaje */
            const percentage=(Math.round(voteUser.length*100/totalVotes))||0
                        
            return(  
              <article key={product.title}>
                <a href={product.external} target='_blank'  ><img src={product.image} />
                <h3>{product.title}</h3></a>
                <hr/> 
                <div className={styles.circle}>
                  <CircularProgress  size={150} strokeWidth={10}
                   percentage={percentage} color={colors[idx]} />
                </div>
                {/* boton para votar */}
               {status!=='pause' && <button   onClick={()=>handlePoll(product.key)} style={{backgroundColor:`${colors[idx]}`}} className={styles.button} type='button'>option {product.key}</button>}
              </article> 
            )

          })
        }
      </section>
      </div>
      
    
  )
}