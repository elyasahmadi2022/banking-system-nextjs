"use client"
import React from 'react'
import CountUp from 'react-countup'

const AnimatedCount  = ({amount}: {amount:number}) => {
  return (
    <div>
      <CountUp 
        decimal=','
        prefix='$'
        decimals={2}
        end={amount}
        
        />
    </div>
  )
}

export default AnimatedCount
