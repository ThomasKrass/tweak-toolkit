import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

interface HeaderProps {
  className?: string
}

const Header = ({ className }: HeaderProps) => {
  const { pathname } = useRouter()

  return (
    <header
      className={classNames(
        'flex flex-row items-center justify-between shadow-md flex-nowrap pl-2 pr-2',
        className,
      )}
    >
      <div className="flex flex-row items-center justify-start w-1/4 gap-6">
        <Link href="/" className="flex flex-row items-center gap-2">
          <Image
            src="/favicon.ico"
            alt="Tweak Icon"
            width={35}
            height={35}
            priority
          />
          <span className="text-xl">Toolkit</span>
        </Link>
      </div>
      <div className="flex flex-row gap-6 font-medium">
        <Link
          href="/stream-config"
          className={classNames(
            'flex flex-row items-center gap-2 hover:text-editing',
            {
              ['text-editing underline underline-offset-2']:
                pathname === '/stream-config',
            },
          )}
        >
          <span>Stream Configuration</span>
        </Link>
        <Link
          href="/platform-control"
          className={classNames(
            'flex flex-row items-center gap-2 hover:text-editing',
            {
              ['text-editing underline underline-offset-2']:
                pathname === '/platform-control',
            },
          )}
        >
          <span>Platform Control</span>
        </Link>
      </div>
      <div className="flex flex-row items-center justify-start w-1/4 gap-6" />
    </header>
  )
}

export default Header
