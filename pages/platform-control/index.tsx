import type { NextPage } from 'next'
import Head from 'next/head'

import SendChatMessageControl from 'components/platform-control/send-chat-message-control'
import SimulateChatControl from 'components/platform-control/simulate-chat-control'

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`Platform Control - ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
      </Head>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold">Platform Control</h1>
          Controls for triggering platform-specific functionality inside of
          Tweak
        </div>
        <section className="flex flex-col gap-2">
          <SendChatMessageControl />
          <SimulateChatControl />
        </section>
      </div>
    </>
  )
}

export default Index
