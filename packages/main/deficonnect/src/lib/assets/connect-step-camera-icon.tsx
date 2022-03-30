import { createElement as CurtomCreateElement } from '../CustomCreateElement'

function ConnectStepCameraIcon(props: { style?: {} }): JSX.Element {
  return (
    <svg width={20} height={21} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.586 2.167H2.361a.694.694 0 00-.694.694v6.606h1.389V3.556h5.53v-1.39zm2.828 1.389v-1.39h6.225c.384 0 .694.312.694.695v6.606h-1.388V3.556h-5.53zm0 13.889h5.53v-5.223h1.39v5.917c0 .383-.311.694-.695.694h-6.225v-1.388zm-8.358-5.223v5.223h5.53v1.388H2.361a.695.695 0 01-.694-.694v-5.917h1.389z"
        fill="#0B1426"
      />
      <path fill="#0B1426" d="M5.833 9.667h8.333v1.667H5.833z" />
    </svg>
  )
}

export default ConnectStepCameraIcon
