import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Index: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/stream-config')
  }, [router])

  return null
}

export default Index
