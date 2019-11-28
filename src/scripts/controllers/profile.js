import profileView from '../views/profile.art'
import profileUpdateView from '../views/profileUpdate.art'
import httpModel from '../models/http'
import store from 'store'
export const profile = async (req, res, next) => {
    let result = await httpModel.get({
        url: "/api/profile"
    })
    if (result.ret) {
        let html = profileView({
            data: result.data
        })
        res.render(html)
        $('#btn-profileupdate,#profile-pic').off('click').on('click', () => {
            res.go('/profile_update')
        })
    } else {
        res.go('/home')
    }
}
export const update = async (req, res, next) => {
    let result = await httpModel.get({
        url: "/api/profile"
    })
    if(result.ret){
        let html = profileUpdateView({
            data: result.data
        })
        res.render(html)
        $("#btn-posback").on('click', function () {
            $(this).off('click')
            res.back()
        })
        let token = store.get('token')
        function showResponse(responseText, statusText){
            let username = result.data.username
            store.remove(username)
            store.set(username,responseText.data.pic)
            let m = responseText.data.message
            alert(m)
            res.back()
         }
        $('#profile-update-form').ajaxForm({
            headers: {
                'X-Access-Token': token
            },
            type:'patch',
            success: showResponse
        })
    }else{
        res.go('/home')
    }
    
}