import React from 'react'
import LoginForm from './LoginForm'
import { redirect } from 'next/navigation'
import { getCustomServerSession } from '@/utils/serverUtils'

const LoginPage = async () => {
  const session = await getCustomServerSession();

  if (session?.user) {
    return redirect('/')
  }

  return (
    <LoginForm />
  )
}

export default LoginPage