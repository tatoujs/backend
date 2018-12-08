
import User from '../models/userModel'
import _ from 'lodash'

const get = async (userFields) => {
  if(_.isEmpty(userFields)) {
    throw new Error('empty user field')
  }

  const user = await User.find(userFields)
}

const service = {
  get,
}

export default service