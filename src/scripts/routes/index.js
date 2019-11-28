import SMERouter from 'sme-router'
import {
    home
} from '../controllers/home'
import {
    login
} from '../controllers/login'
import * as position from '../controllers/position'
import * as profile from '../controllers/profile'
import breadcrumView from '../views/breadcrum.art'
import headerController from '../controllers/header'
import {reg} from '../controllers/reg'
const router = new SMERouter('container-fluid')

router.use((req) => {
    let url = req.url.slice(1)
    let urls = url.split('?')[0].split('_')[0].split('/')[0]
    $(`.side-btn[data-url=${urls}]`).addClass('active').siblings().removeClass('active')
    headerController.render()
    let breadcrumbMap = {}
    switch (urls) {
        case 'home':
            breadcrumbMap = {
                level1: '首页',
                level2: '海南航空后台管理系统',
                level3: '首页'
            }
            break;
        case 'position':
            breadcrumbMap = {
                level1: '机票管理',
                level2: '海南航空后台管理系统',
                level3: '机票管理'
            }
            break;
        case 'profile':
            breadcrumbMap = {
                level1: '个人空间',
                level2: '海南航空后台管理系统',
                level3: '个人空间'
            }
            break;
        case 'userlist':
            breadcrumbMap = {
                level1: '用户列表',
                level2: '海南航空后台管理系统',
                level3: '用户列表'
            }
            break;
        default:
            breadcrumbMap = {
                level1: '',
                level2: '',
                level3: ''
            }
            break;
    }
    let html = breadcrumView({
        breadcrumbMap
    })
    $('.content-header').html(html)
})

router.route('/home', home)
router.route('/profile', profile.profile)
router.route('/profile_update',profile.update)
router.route('/login', login)
router.route('/reg',reg)
router.route('/position', position.list)
router.route('/position_add', position.add)
router.route('/position_update', position.update)
router.route('/position_list/:page',position.list)


router.route('*', (req, res, next) => {
    res.redirect('/home')
})
export default router