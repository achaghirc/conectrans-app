type Colors = {
  logoColor: string;
  proColor: string;
  conduColor: string;
  iconColor: string;
  starColor: string;
}

type ConectransLogoProps = {
    width: string | number;
    height: string | number;
    colors: Colors;
}

const NoDataFolder = () => {
    return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M112.99 32.5L164.952 122.5C170.725 132.5 163.509 145 151.962 145H48.0385C36.4915 145 29.2746 132.5 35.0481 122.5L87.0096 32.5C92.7831 22.5 107.217 22.5 112.99 32.5Z" fill="white" stroke="#01717A" strokeWidth="10"/>
    <rect x="93" y="52" width="14" height="51" rx="7" fill="#01717A" fill-opacity="0.51"/>
    <circle cx="100" cy="119" r="6" fill="#7DB7BB"/>
    </svg>

    )
}

export default NoDataFolder;