import type { NextPage } from 'next'
import Head from 'next/head'

import BaseConfigControl from 'components/stream-config/base-config-control'
import SceneConfigControl from 'components/stream-config/scene-config-control'

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`Stream Configuration - ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
      </Head>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold">Stream Configuration</h1>
          Controls for managing the streamer&apos;s configuration inside of
          Tweak
        </div>
        <section className="flex flex-col gap-2">
          <BaseConfigControl />
          <SceneConfigControl />
        </section>
      </div>
    </>
  )
}

export default Index
