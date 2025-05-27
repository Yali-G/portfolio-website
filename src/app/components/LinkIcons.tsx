import React from 'react'
import Image from "next/image";


const LinkIcons = () => {
  return (
    <div className="link-icon-image">
            
            <a href="https://www.linkedin.com/in/yali-goldstein/" target="_blank" rel="noopener noreferrer">
                <Image src="/linkedin.svg" alt="LinkedIn icon" />
            </a>

            <a href="mailto:goldstein.yali1@gmail.com">
                <Image src="/email.svg" alt="Email icon" />
            </a>

            <a href="https://github.com/Yali-G" target="_blank" rel="noopener noreferrer">
                <Image src="/github.svg" alt="GitHub icon" />
            </a>

        </div>
  )
}

export default LinkIcons