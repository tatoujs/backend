
import axios from 'axios'

// Fake login method
const login = async (fields) => {
  const { username, password } = fields
  const config = {
    headers: {
      Accept: 'application/vnd.heroku+json; version=3',
    },
    auth: { username, password },
  }

  const response = await axios.get('https://api.heroku.com/apps', config)

  const apps = response.data.map(obj => {
    return {
      id: obj.id,
      name: obj.name,
    }
  })

  return { username, apps }
}

const createDrain = async (appId, auth) => {
  const config = {
    headers: {
      Accept: 'application/vnd.heroku+json; version=3',
      Authorization: auth,
    },
  }

  const response = await axios.post(`https://api.heroku.com/apps/${appId}/log-drains`, {
    url: `http://tatoujsapp.herokuapp.com/heroku/apps/${appId}/logs`,
  }, config);

  return response.data
}

const getDrains = async (appId, auth) => {
  const config = {
    headers: {
      Accept: 'application/vnd.heroku+json; version=3',
      Authorization: auth,
    },
  };

  const previousDrains = await axios.get(`https://api.heroku.com/apps/${appId}/log-drains`, config);

  return previousDrains.data
}

const service = {
  login,
  getDrains,
  createDrain,
}

export default service