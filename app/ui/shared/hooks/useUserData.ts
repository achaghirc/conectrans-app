'use client';
import { PASSWORD_DEFAULT } from '@/lib/constants';
import { User, UserDTO } from '@prisma/client';
import { Session } from 'next-auth'
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react'

const useUserData = (session: Session) => {
  const router = useRouter();
  const [userData, setUserData] = React.useState<UserDTO>({
      email: '',
      password: '',
      id: '',
      name: '',
      roleCode: '',
      assetUrl: 'https://res.cloudinary.com/dgmgqhoui/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_grey,b_rgb:262c35/v1734182403/default-logo-user_fj0tu3.png',
    } as UserDTO);
  
  const getUserData = useMemo(() => {
    if (!session) return null;
    const {user} = session;
    if (!user) return null;
    
    
    const result: UserDTO = {
      ...userData,
      email: user.email || '',
      password: PASSWORD_DEFAULT,
      id: user.id || '',
      name: user.name || '',
      roleCode: user.roleCode || '',
      assetUrl: user.assetUrl ?? userData.assetUrl,
      personId: session.user.personId,
      companyDescription: session.user.companyDescription,
    };
    
    return result;
  }, [session, userData]);


    useEffect(() => {
      if (!session.user){
        router.push('/auth/login');
      } else {
        const user = getUserData;
        if (user)
          setUserData(user);
      }
    }, [session]);

    return {userData}
}

export default useUserData
