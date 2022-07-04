import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: ''
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    }
}

const actions = {
    // user login
    // 登录
    // login({ commit }, userInfo) {
    //   // 解构出账号密码
    //   const { username, password } = userInfo
    //   return new Promise((resolve, reject) => {
    //     login({ username: username.trim(), password: password }).then(response => {
    //       // 从response中解构出data
    //       const { data } = response
    //       // 提交mutation当中SET_TOKEN函数保存token到仓库
    //       commit('SET_TOKEN', data.token)
    //       // 将获取的token保存到了本地
    //       setToken(data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    //  方法2：
    async login({ commit }, userInfo) {
        // 解构出账号密码
        const { username, password } = userInfo
        let result = await login({ username: username.trim(), password: password })
        if (result.code == 200 || result.code == 20000) {
            // 提交mutation当中SET_TOKEN函数保存token到仓库
            commit('SET_TOKEN', result.data.token);
            // 将获取的token保存到了本地
            setToken(result.data.token);
            // 如果成功，return  ok
        } else {
            return Promise.reject(new Error('faile'));
        }
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const { data } = response

                if (!data) {
                    return reject('Verification failed, please Login again.')
                }

                const { name, avatar } = data

                commit('SET_NAME', name)
                commit('SET_AVATAR', avatar)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}