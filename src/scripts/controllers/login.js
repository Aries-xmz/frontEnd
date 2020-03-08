import loginView from '../views/login.art'
import httpModel from '../models/http'
export const login = async (req, res, next) => {
    res.render(loginView())
    $('#btn-login').off('click').on('click', handleSumbit)
    async function handleSumbit() {
        let data = $('#loginForm').serialize()
        let username = $('#username').val()
        let password = $('#password').val()
        if (username && password) {
            let result = await httpModel.get({
                type: "POST",
                url: '/api/admin/signin',
                data
            })
            if (result.ret) {
                res.go('/home')
            } else {
                alert(result.data.message)
            }
            $('#loginForm')[0].reset()
        } else {
            alert('用户名或密码不能为空')
        }
    }
}