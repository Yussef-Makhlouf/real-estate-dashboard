export const syncTokenToCookies = () => {
    const token = localStorage.getItem('token')
    if (token) {
      document.cookie = `auth-token=${token}; path=/`
    }
  }