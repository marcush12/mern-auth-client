import cookie from 'js-cookie'

// set in cookie
export const setCookie = (key, value) => {// key is the cookies name
  if(window !== 'undefined') {
    cookie.set(key, value, {
      expires: 1
    })
  }
}

// remove from cookie
export const removeCookie = (key) => {
  if(window !== 'undefined') {
    cookie.remove(key, {
      expires: 1
    })
  }
}
// get from cookie such as stored token
// will be useful when we nee to make request to server w token
export const getCookie = (key) => {
  if(window !== 'undefined') {
    return cookie.get(key)
  }
}

// set in LS
export const setLocalStorage = (key, value) => {// key is the cookies name
  if(window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

// remove from LS
export const removeLocalStorage = (key) => {// key is the cookies name
  if(window !== 'undefined') {
    localStorage.removeItem(key)
  }
}

// authenticate user by passing data to cookie and LS during signin
export const authenticate = (response, next) => {
  console.log('AUTHENTICATE HELPER ON SIGNIN RESPONSE ', response);
  setCookie('token', response.data.token)
  setLocalStorage('user', response.data.user)
  next()
}

// access user info from LS
export const isAuth = () => {
  if(window !== 'undefined') {
    const cookieChecked = getCookie('token')
    if(cookieChecked) {
      if(localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user'))
      } else {
        return false
      }
    }
  }
}

export const signout = next => {
  removeCookie('token')
  removeLocalStorage('user')
  next()
}

export const updateUser = (response, next) => {
  console.log("UPDATE USER IN LS HELPERS", response);
  if(typeof window !== 'undefined') {
    let auth = JSON.parse(localStorage.getItem('user'))
    auth = response.data
    localStorage.setItem('user', JSON.stringify(auth))
  }
  next()
} 