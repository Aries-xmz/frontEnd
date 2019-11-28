import positionView from '../views/position.art'
import httpModel from '../models/http'
import positionAddView from '../views/positionAdd.art'
import positionUpdateView from '../views/positionUpdate.art'
const _ = require('lodash')
let count = 5
let temp = ''
let flag = false

function _handlePageNumClick(req, res, obj) {
    let type = $(obj).attr('aria-label')
    let fp = $(obj).parent().next()
    let lastp = $(obj).parent().prev()
    let page = ~~req.params.page || 1
    switch (type) {
        case 'Previous':
            if (!fp.hasClass('active')) {
                page--
                res.go('/position_list/' + page)
            }
            break;
        case 'Next':
            if (!lastp.hasClass('active')) {
                page++
                res.go('/position_list/' + page)
            }
            break;
        default:
            res.go('/position_list/' + $(obj).text())
            break;
    }
}

function _handleAddClick(res) {
    $('#btn-add').off('click').on('click', () => {
        res.go('/position_add')
    })
}

function _handleUpdateClick(obj, res) {
    let id = $(obj).attr('data-id')
    res.go('/position_update', {
        id
    })
}

async function _handleDeleteClick(obj, res, req) {
    let id = $(obj).attr('data-id')
    let result = await httpModel.update({
        type: 'delete',
        url: '/api/position',
        data: 'id=' + id
    })
    alert(result.data.message)
    if (result.ret) {
        res.go('/position_list/' + req.params.page + '?r=' + new Date().getTime())
    }
}
async function _handleSearch(res, val) {
    temp = val
    if (location.hash !== "#/position") {
        res.go('/position')
    } else {
        res.go('/position_list/1')
    }
}

export const list = async (req, res, next) => {
    let url
    let type
    if (flag) {
        url = "/api/position/search"
        type = "post"
    } else {
        url = "/api/position"
        type = "get"
    }
    let currentPage = ~~req.params.page || 1
    let result = await httpModel.get({
        url,
        type,
        data: {
            keywords: temp,
            start: (currentPage - 1) * count,
            count
        }
    })
    if (result.ret) {
        let {
            list,
            total
        } = result.data
        res.render(positionView({
            list,
            pageCount: _.range(1, Math.ceil(total / count) + 1),
            currentPage
        }))
        _handleAddClick(res)
        $('.btn-delete').off('click').on('click', function () {
            _handleDeleteClick(this, res, req)
        })
        $('.btn-update').off('click').on('click', function () {
            _handleUpdateClick(this, res)
        })
        $('.page-num,.page-up,.page-down').off('click').on('click', function () {
            _handlePageNumClick(req, res, this)
        })
        $('#button-addon1').off('click').on('click', function () {
            let val = $('#search').val()
            flag = true
            _handleSearch(res, val)
        })
        $('#btn-all').off('click').on('click', function () {
            flag = false
            _handleSearch(res)
        })
    } else {
        res.go('/home')
    }
}
export const add = (req, res, next) => {
    res.render(positionAddView())
    $('#btn-posadd').on('click', async () => {
        let $form = $('#position-add-form')
        let data = $form.serialize()
        let result = await httpModel.update({
            url: '/api/position',
            data,
            type: 'post'
        })
        if (result.ret) {
            $form[0].reset()
        }
        alert(result.data.message)
    })
    $("#btn-posback").on('click', function () {
        $(this).off('click')
        res.back()
    })
}

export const update = async (req, res, next) => {
    let id = req.body.id
    let result = await httpModel.get({
        url: 'api/position/findOne',
        data: 'id=' + id
    })
    let item = result.data.result
    res.render(positionUpdateView({
        item
    }))
    $('#btn-posupdate').on('click', async function () {
        let data = $('#position-add-form').serialize()
        let result = await httpModel.update({
            url: '/api/position',
            type: 'patch',
            data: data + '&id=' + id
        })
        if (result.ret) {
            $(this).off('click')
            res.back()
        }
        alert(result.data.message)
    })

    $("#btn-posback").on('click', function () {
        $(this).off('click')
        res.back()
    })
}