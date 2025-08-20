'use client'

import css from './not-found.module.css'
import Link from 'next/link';

const NotFound = () => {
    return ( 
    <div className={css.container}>
      <h1 className={css.errorCode}>404</h1>
      <h2 className={css.title}>Page Not Found</h2>
      <p className={css.description}>
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>
      <Link href="/" className={css.homeButton}>
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;