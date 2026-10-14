import { formatAmount } from '@/lib/utils'
import React from 'react'
import CountUp from 'react-countup'
import AnimatedCount from './animated-count'
import DoughnutChart from './doughnut-chart'

const TotalBalanceBox = ({
    accounts=[],
    totalBanks,
    totalCurrentBalance
}:TotalBalanceBoxProps) => {
  return (
    <section className='total-balance'>
            <div className='total-balance-chart'>
                <DoughnutChart accounts={accounts} />
            </div>
            <div className='flex flex-col gap-6'>
                <h2 className='header-2'>
                    Bank Accounts: {totalBanks}
                </h2>
                <div className='flex flex-col gap-2'>
                    <p className='total-balance-label'>
                        Total Current Balance
                    </p>
                    <div className='total-balance-amount flex-center gap-2 '>
                        <AnimatedCount amount={totalCurrentBalance} />
                    </div>
                </div>
            </div>
    </section>
  )
}

export default TotalBalanceBox
