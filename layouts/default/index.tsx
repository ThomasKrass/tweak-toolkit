import { PropsWithChildren } from 'react'

import Header from 'layouts/default/header'

type DefaultLayoutProps = PropsWithChildren

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
      <Header className="fixed z-10 top-0 left-0 right-0 h-[50px] bg-white" />
      <main className="container mx-auto px-4 pt-[60px]">{children}</main>
    </>
  )
}
