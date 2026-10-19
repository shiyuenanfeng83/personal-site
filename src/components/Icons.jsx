const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function GithubIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 4.9-1.5 4.9-5.6A4.4 4.4 0 0 0 17.6 5a4.1 4.1 0 0 0-.1-3s-1.2-.4-4 1.5a10.6 10.6 0 0 0-5.6 0C5.1 1.6 3.9 2 3.9 2a4.1 4.1 0 0 0-.1 3A4.4 4.4 0 0 0 2.5 8.9c0 4.1 1.9 5.3 4.9 5.6a3.4 3.4 0 0 0-.9 2.6V22" />
    </svg>
  )
}

export function MailIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

export function LinkIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  )
}

export function WechatIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4.5c-3.6 0-6.5 2.3-6.5 5.2 0 1.7 1 3.2 2.5 4.1L4.5 16l2.3-1.2c.7.2 1.4.3 2.2.3h.6" />
      <path d="M21.5 14.3c0-2.5-2.5-4.5-5.6-4.5s-5.6 2-5.6 4.5c0 2.5 2.5 4.5 5.6 4.5.7 0 1.4-.1 2-.3l2 1.1-.5-1.8c1.3-.8 2.1-2 2.1-3.5Z" />
    </svg>
  )
}

export function SunIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  )
}

export function MoonIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  )
}

export function ArrowIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  )
}

export function MenuIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function CloseIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6 18 18M18 6 6 18" />
    </svg>
  )
}

export const socialIcons = {
  github: GithubIcon,
  mail: MailIcon,
  link: LinkIcon,
  wechat: WechatIcon,
}
