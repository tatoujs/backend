
// Fake login method
const login = async (fields) => {
  const { username } = fields

  return {
    username,
    token: 'dskch8ei7sducwsduxc'
  }
}

const service = {
  login,
}

export default service