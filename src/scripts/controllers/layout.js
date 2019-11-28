import layoutView from '../views/layout.art'
// import httpModel from '../models/http'
// import headerController from '../controllers/header'
import store from 'store'
class Layout {

    constructor() {
        this.render()
    }
    render() {
        let html = layoutView()
        $('#root').html(html)
        $('header').on('click',this.headerClick.bind(this));
        $('.menu-loginout').on('click', this.signout)
    }
    headerClick(ev) {
        if (ev.target == $('.sidebar-toggler')[0]) {
            $('.sidebar').toggleClass('shrink show');
        } else if (ev.target == $('#log')[0]) {
            this.signout()
        }
    }
    async signout() {
        // 基于localstorage的的注销操作
        store.remove('token')
        // 基于session和cookie的注销操作
        /*let result = await httpModel.get({
            url: '/api/users/signout',
        })
        if (result.ret) {
            headerController.render()
        }*/
    }
}
export default new Layout()