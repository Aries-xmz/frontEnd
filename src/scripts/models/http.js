import store from 'store'
export default {
    get({
        url,
        type = 'GET',
        data = {}
    }) {
        let token = store.get('token')
        return $.ajax({
            url,
            type,
            data,
            headers: {
                'X-Access-Token': token
            },
            dataType: 'json',
            success: (result, textstatus, jqXHR) => {
                let token = jqXHR.getResponseHeader('x-access-token')
                if (token) {
                    store.set('token', token)
                }
                return result
            }
        })
    },
    update({
        url,
        data = {},
        type = 'post'
    }) {
        let token = store.get('token')
        return $.ajax({
            url,
            data,
            type,
            headers: {
                'X-Access-Token': token
            },
            success(result) {
                if (token)
                    return result
            }
        })
    }
}