import { createElement as CurtomCreateElement } from '../CustomCreateElement'

function DeFiLinkIconLight(props: {}): JSX.Element {
  return (
    <svg width={60} height={60} viewBox="5 5 66 66" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g filter="url(#prefix__filter0_d)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M42.054 20.5c4.016 0 6.023 0 8.185.683a8.495 8.495 0 015.078 5.078c.683 2.161.683 4.17.683 8.185v12.108c0 4.016 0 6.023-.683 8.185a8.494 8.494 0 01-5.078 5.077c-2.162.684-4.169.684-8.185.684H29.946c-4.016 0-6.024 0-8.185-.684a8.494 8.494 0 01-5.078-5.077C16 52.577 16 50.57 16 46.554V34.446c0-4.016 0-6.024.683-8.185a8.495 8.495 0 015.078-5.078c2.161-.683 4.169-.683 8.185-.683h12.108z"
          fill="#fff"
        />
        <mask id="prefix__a" maskUnits="userSpaceOnUse" x={16} y={20} width={40} height={41}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M42.054 20.5c4.016 0 6.023 0 8.185.683a8.495 8.495 0 015.078 5.078c.683 2.161.683 4.17.683 8.185v12.108c0 4.016 0 6.023-.683 8.185a8.494 8.494 0 01-5.078 5.077c-2.162.684-4.169.684-8.185.684H29.946c-4.016 0-6.024 0-8.185-.684a8.494 8.494 0 01-5.078-5.077C16 52.577 16 50.57 16 46.554V34.446c0-4.016 0-6.024.683-8.185a8.495 8.495 0 015.078-5.078c2.161-.683 4.169-.683 8.185-.683h12.108z"
            fill="#fff"
          />
        </mask>
        <g mask="url(#prefix__a)" fillRule="evenodd" clipRule="evenodd">
          <path d="M35.98 24.485l-14.042 8.01v16.023L35.98 56.53l14.043-8.012V32.496L35.98 24.485z" fill="#FEFEFE" />
          <path
            d="M35.98 24.485l-14.042 8.01v16.023L35.98 56.53l14.043-8.012V32.496L35.98 24.485zm-5.544 6.927h11.051l1.333 5.567H29.154l1.282-5.567zm3.184 9.517l-1.205-3.11h7.156l-1.18 3.11.343 3.474-2.754.012h-2.728l.368-3.486zm3.515 7.16v-1.103l2.474-2.344v-3.7l3.236-2.081 3.693 2.746-5.026 8.652H39.52l-2.385-2.17zm-11.711-6.482l3.704-2.721 3.274 2.056v3.7l2.474 2.344v1.103l-2.385 2.195h-2.018l-5.05-8.677z"
            fill="#002D72"
          />
          <path
            d="M41.512 50.259H39.52l-2.385-2.17v-1.103l2.474-2.345v-3.7l3.236-2.08 3.693 2.746-5.026 8.652zM35.98 24.485v6.927h5.507l1.333 5.567h-6.84v.84h3.591l-1.18 3.11.343 3.474-2.754.012V56.53l14.043-8.012V32.496L35.98 24.485z"
            fill="url(#prefix__paint0_linear)"
            style={{
              mixBlendMode: 'multiply',
            }}
          />
          <path
            d="M34.876 48.09l-2.385 2.194h-2.018l-5.05-8.677 3.705-2.721 3.274 2.056v3.7l2.474 2.344v1.103zm-1.624-3.675l.368-3.486-1.205-3.11h3.565v-.84h-6.826l1.282-5.567h5.544v-6.927l-14.042 8.01v16.023L35.98 56.53V44.415h-2.728z"
            fill="url(#prefix__paint1_linear)"
            style={{
              mixBlendMode: 'multiply',
            }}
          />
        </g>
      </g>
      <defs>
        <linearGradient
          id="prefix__paint0_linear"
          x1={48.526}
          y1={53.073}
          x2={48.526}
          y2={27.863}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#002D72" />
          <stop offset={1} stopColor="#002D72" stopOpacity={0.01} />
        </linearGradient>
        <linearGradient
          id="prefix__paint1_linear"
          x1={34.483}
          y1={53.073}
          x2={34.483}
          y2={27.863}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#002D72" stopOpacity={0.01} />
          <stop offset={1} stopColor="#002D72" />
        </linearGradient>
        <filter
          id="prefix__filter0_d"
          x={-4}
          y={0.5}
          width={80}
          height={80}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation={10} />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  )
}

export default DeFiLinkIconLight
