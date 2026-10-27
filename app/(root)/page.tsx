import HeaderBox from '@/components/header-box'
import RightSidebar from '@/components/right-bar'
import TotalBalanceBox from '@/components/total-balance-box'
import { getAccount, getAccounts } from '@/lib/actions/bank.actions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { SearchParamProps } from '@/types'
import React from 'react'

const page = async ({
    params, searchParams
}: SearchParamProps) => {
    const {id} = await params

    const loggedUser = await getLoggedInUser()
   
    const accounts = await getAccounts({userId: loggedUser.$id})
    const appwriteItemId = (id as string) || accounts.data?.[0]?.appwriteItemId
    
    const account = await getAccount({appwriteItemId});
    console.log(account)
  return (
    <section className="home">
        <div className="home-content">
            <header className='home-header'>
                <HeaderBox type="greeting" title="Welcome" subtext="access and manage your account and transactions effecintly." user={loggedUser?.name} />
                <TotalBalanceBox accounts={[]} totalBanks={1} totalCurrentBalance={1432.09}/>
            </header>
            RECENT TRANSACTION
        </div>
        <RightSidebar 
            user={loggedUser}
            transactions={[]}
            banks={[{currentBalance: 124.3, name: "mr.joba"}, {currentBalance: 900.3, name: "Mr.team"}]}
        />
    </section>
  )
}

export default page
