import headerView from '../views/header.art'
import httpModel from '../models/http'
import store from 'store'
class Header {
    async render() {
        let result = await httpModel.get({
            url: '/api/admin/isSignin',
        })
        let isSignin = result.data.isSignin
        let username = result.data.username
        let pic
        if (store.get(username)) {
            pic = store.get(username)
        } else {
            pic = "nophoto.jpg"
        }
        let html = headerView({
            isSignin,
            username,
            pic
        })
        $('header').html(html)
    }
}
export default new Header()