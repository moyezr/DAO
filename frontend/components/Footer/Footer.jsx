import React from 'react'

const Footer = () => {
  return (
    <footer className="footer">
    <p className="footer-text">Made with ❤️ by Moyez Rabbani</p>
<style jsx>{`
        .footer {
          width: 100%;
          display: flex;
          padding: 0;
          margin: 0;
          margin-top: 3rem;
          padding-top: 1rem;
          border-top:1px solid black;
          justify-content: center;
          align-items: center;
        }
        p {
          color: black;
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </footer>
  )
}

export default Footer