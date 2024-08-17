import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'
import { Button } from './ui/button'
import { createLinkToken, exchangePublicToken } from '../lib/actions/user.action'
import Image from 'next/image'

const PlaidLink = ({user, variant}: PlaidLinkProps) => {
    
    const router  = useRouter()

    const [token, setToken] = useState('')

    useEffect(() => {
        const getLinkToken = async () => {
            
            const data = await createLinkToken(user)  
            setToken(data?.linkToken)
        }
        getLinkToken()
    }, [user])

    const onSuccess = useCallback<PlaidLinkOnSuccess>( async (public_token: string) => {

        await exchangePublicToken({
            publicToken: public_token,
            user
        })
        router.push('/')
    }, [user])


    const config: PlaidLinkOptions = {
        token,
        onSuccess
    }

    const { open, ready } = usePlaidLink(config)
  return (
    <div>
    <>
    {variant === "primary" ? (
        <Button className='plaidlink-primary' disabled={!ready} onClick={() => open()}>
        Connect Bank
        </Button>
    ) : variant === "ghost" ?(
        <Button variant="ghost" onClick={() => open()} className='plaidlink-ghost'>
         <Image src='/icons/connect-bank.svg' width={24} height={24} alt='Connect Bank'/>
            <p className='hidden text-[16px] font-semibold text-black-2 xl:block' >Connect Bank</p>
        </Button>
    ) : (
        <Button onClick={() => open()} className='plaidlink-default'>
            <Image src='/icons/connect-bank.svg' width={24} height={24} alt='Connect Bank'/>
            <p className='text-[16px] font-semibold text-black-2' >Connect Bank</p>
        Connect Bank
        </Button>
    )}
    
    </>
      
    </div>
  )
}

export default PlaidLink
