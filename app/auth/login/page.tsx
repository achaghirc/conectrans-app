import React from 'react'
import LoginModal from '../../ui/auth/login';

export default function Auth(props: { disableCustomTheme?: boolean }) {
    return (
      <>
        <LoginModal />
      </>
    );
}