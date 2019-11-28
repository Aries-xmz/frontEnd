import regView from '../views/reg.art'
import httpModel from '../models/http'
export const reg =async (req,res,next)=> {
    res.render(regView())
    $('#btn-reg').off('click').on('click',handleSumbit)
     async function handleSumbit() {
        let data = $('#regForm').serialize()
        let result = await httpModel.get({
            type: "POST",
            url: '/api/users/signup',
            data
        })
        alert(result.data.message)
        $('#regForm')[0].reset()
        if (result.ret) {
            res.go('/login')
        }
    }
}