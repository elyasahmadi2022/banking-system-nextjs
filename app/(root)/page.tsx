import HeaderBox from '@/components/header-box'
import RightSidebar from '@/components/right-bar'
import TotalBalanceBox from '@/components/total-balance-box'
import React from 'react'

const page = () => {
    const loginUser = {
        firstName: "elyas",
        lastName: "ahmadi",
        email: "contact@bigTech.pro"
    }
  return (
    <section className="home">
        <div className="home-content">
            <header className='home-header'>
                <HeaderBox type="greeting" title="Welcome" subtext="access and manage your account and transactions effecintly." user={loginUser.firstName} />
                <TotalBalanceBox accounts={[]} totalBanks={1} totalCurrentBalance={1432.09}/>
            </header>
            RECENT TRANSACTION
        </div>
        <RightSidebar 
            user={loginUser}
            transactions={[]}
            banks={[{currentBalance: 124.3, name: "mr.joba"}, {currentBalance: 900.3, name: "Mr.team"}]}
        />
    </section>
  )
}

export default page
